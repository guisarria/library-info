import { cacheLife, cacheTag } from "next/cache"
import { parsePackageNames } from "@/lib/package-query"
import type { Package } from "@/lib/types"

const NPMS_API_BASE_URL = "https://api.npms.io/v2"
const NPMS_PACKAGE_ENDPOINT = `${NPMS_API_BASE_URL}/package/mget`
const NPM_REGISTRY_BASE_URL = "https://registry.npmjs.org"
const ECOSYSTEMS_PACKAGE_BASE_URL =
  "https://packages.ecosyste.ms/api/v1/registries/npmjs.org/packages"
const MAX_PACKAGES_PER_LOOKUP = 50
const FALLBACK_PACKAGE_LOOKUP_CONCURRENCY = 8

type NpmsErrorResponse = {
  code?: unknown
  message?: unknown
}

type NpmsPackageLookupResponse = Record<string, Package | undefined>

type NpmRegistryRepository =
  | string
  | {
      url?: unknown
    }

type NpmRegistryBugs =
  | string
  | {
      url?: unknown
    }

type NpmRegistryVersion = {
  bugs?: NpmRegistryBugs
  homepage?: unknown
  repository?: NpmRegistryRepository
}

type NpmRegistryPackument = {
  "dist-tags"?: Record<string, unknown>
  bugs?: NpmRegistryBugs
  description?: unknown
  homepage?: unknown
  name?: unknown
  readme?: unknown
  repository?: NpmRegistryRepository
  versions?: Record<string, NpmRegistryVersion | undefined>
}

type EcosystemsPackageResponse = {
  description?: unknown
  homepage?: unknown
  repo_metadata?: unknown
  repository_url?: unknown
}

type EcosystemsRepoMetadata = {
  forks_count?: unknown
  homepage?: unknown
  html_url?: unknown
  stargazers_count?: unknown
  subscribers_count?: unknown
}

export async function fetchPackages(query: string) {
  "use cache"
  cacheLife({
    stale: 60 * 60,
    revalidate: 6 * 60 * 60,
    expire: 24 * 60 * 60
  })
  cacheTag("packages")

  const packageNames = parsePackageNames(query).slice(
    0,
    MAX_PACKAGES_PER_LOOKUP
  )

  if (packageNames.length === 0) {
    return []
  }

  return await fetchPackageBatch(packageNames)
}

async function fetchPackageBatch(packageNames: readonly string[]) {
  let packageLookup = new Map<string, Package>()
  let npmsError: Error | undefined

  try {
    packageLookup = await fetchNpmsPackageBatch(packageNames)
  } catch (error) {
    npmsError =
      error instanceof Error
        ? error
        : new Error("Failed to fetch packages from npms.io")
  }

  const missingPackageNames = packageNames.filter(
    (packageName) => !packageLookup.has(packageName)
  )

  if (missingPackageNames.length > 0) {
    const fallbackLookup =
      await fetchNpmRegistryPackageBatch(missingPackageNames)

    for (const [packageName, packageData] of fallbackLookup) {
      packageLookup.set(packageName, packageData)
    }
  }

  if (packageLookup.size === 0 && npmsError) {
    throw npmsError
  }

  return packageNames.flatMap((packageName) => {
    const packageData = packageLookup.get(packageName)

    return packageData ? [packageData] : []
  })
}

async function fetchNpmsPackageBatch(packageNames: readonly string[]) {
  const response = await fetch(NPMS_PACKAGE_ENDPOINT, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(packageNames)
  })

  const data = await readJson(response)

  if (!response.ok) {
    throw new Error(
      `Failed to fetch packages from npms.io: ${formatNpmsError(
        response,
        data
      )}`
    )
  }

  if (!isRecord(data)) {
    throw new Error(
      "Failed to fetch packages from npms.io: unexpected response"
    )
  }

  const packages = data as NpmsPackageLookupResponse
  const packageLookup = new Map<string, Package>()

  for (const packageName of packageNames) {
    const packageData = packages[packageName]

    if (!packageData) {
      continue
    }

    packageLookup.set(packageName, {
      ...packageData,
      name:
        packageData.name ?? packageData.collected?.metadata?.name ?? packageName
    })
  }

  return packageLookup
}

async function fetchNpmRegistryPackageBatch(packageNames: readonly string[]) {
  const packageEntries = await mapWithConcurrency(
    packageNames,
    FALLBACK_PACKAGE_LOOKUP_CONCURRENCY,
    async (packageName) => {
      const packageData = await fetchNpmRegistryPackage(packageName)

      return packageData ? ([packageName, packageData] as const) : undefined
    }
  )

  return new Map(packageEntries.filter((entry) => entry !== undefined))
}

async function fetchNpmRegistryPackage(packageName: string) {
  const registryPackage = await fetchNpmRegistryPackument(packageName)

  if (!registryPackage) {
    return
  }

  const ecosystemsPackage = await fetchEcosystemsPackage(packageName)

  return createFallbackPackage(packageName, registryPackage, ecosystemsPackage)
}

async function fetchNpmRegistryPackument(packageName: string) {
  try {
    const response = await fetch(
      `${NPM_REGISTRY_BASE_URL}/${encodeURIComponent(packageName)}`,
      {
        headers: {
          Accept: "application/json"
        }
      }
    )

    if (!response.ok) {
      return
    }

    const data = await readJson(response)

    return isRecord(data) ? (data as NpmRegistryPackument) : undefined
  } catch {
    return
  }
}

async function fetchEcosystemsPackage(packageName: string) {
  try {
    const response = await fetch(
      `${ECOSYSTEMS_PACKAGE_BASE_URL}/${encodeURIComponent(packageName)}`,
      {
        headers: {
          Accept: "application/json"
        }
      }
    )

    if (!response.ok) {
      return
    }

    const data = await readJson(response)

    return isRecord(data) ? (data as EcosystemsPackageResponse) : undefined
  } catch {
    return
  }
}

function createFallbackPackage(
  requestedName: string,
  registryPackage: NpmRegistryPackument,
  ecosystemsPackage: EcosystemsPackageResponse | undefined
): Package {
  const packageName = getString(registryPackage.name) ?? requestedName
  const latestVersion = getString(registryPackage["dist-tags"]?.latest)
  const latestPackage = latestVersion
    ? registryPackage.versions?.[latestVersion]
    : undefined
  const repository =
    normalizeRepositoryUrl(registryPackage.repository) ??
    normalizeRepositoryUrl(latestPackage?.repository) ??
    getString(ecosystemsPackage?.repository_url)
  const homepage =
    getString(registryPackage.homepage) ??
    getString(latestPackage?.homepage) ??
    getString(ecosystemsPackage?.homepage)
  const bugs =
    normalizeBugsUrl(registryPackage.bugs) ??
    normalizeBugsUrl(latestPackage?.bugs)
  const readme = getString(registryPackage.readme) ?? ""
  const description =
    getString(registryPackage.description) ??
    getString(ecosystemsPackage?.description)

  return {
    collected: {
      github: createFallbackGithubData(ecosystemsPackage, repository, homepage),
      metadata: {
        description,
        links: {
          bugs,
          homepage,
          npm: `https://www.npmjs.com/package/${packageName}`,
          repository
        },
        name: packageName,
        readme
      }
    },
    name: packageName
  }
}

function createFallbackGithubData(
  ecosystemsPackage: EcosystemsPackageResponse | undefined,
  repository: string | undefined,
  homepage: string | undefined
) {
  const repoMetadata = isRecord(ecosystemsPackage?.repo_metadata)
    ? (ecosystemsPackage.repo_metadata as EcosystemsRepoMetadata)
    : undefined
  const repositoryHomepage =
    getString(repoMetadata?.html_url) ?? repository ?? homepage

  if (!(repoMetadata && repositoryHomepage)) {
    return
  }

  return {
    forksCount: getFiniteNumber(repoMetadata.forks_count),
    homepage: repositoryHomepage,
    starsCount: getFiniteNumber(repoMetadata.stargazers_count),
    subscribersCount: getFiniteNumber(repoMetadata.subscribers_count)
  }
}

async function readJson(response: Response) {
  const contentType = response.headers.get("content-type")

  if (!contentType?.includes("application/json")) {
    return
  }

  try {
    return (await response.json()) as unknown
  } catch {
    return
  }
}

function formatNpmsError(response: Response, data: unknown) {
  if (!isRecord(data)) {
    return `${response.status} ${response.statusText}`.trim()
  }

  const error = data as NpmsErrorResponse
  const message = typeof error.message === "string" ? error.message : undefined
  const code = typeof error.code === "string" ? error.code : undefined

  if (message && code) {
    return `${response.status} ${message} (${code})`
  }

  return `${response.status} ${message ?? code ?? response.statusText}`.trim()
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

async function mapWithConcurrency<T, TResult>(
  values: readonly T[],
  concurrency: number,
  mapper: (value: T) => Promise<TResult>
) {
  const results: TResult[] = []

  for (let index = 0; index < values.length; index += concurrency) {
    const batch = values.slice(index, index + concurrency)
    results.push(...(await Promise.all(batch.map(mapper))))
  }

  return results
}

function getString(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : undefined
}

function getFiniteNumber(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : 0
}

function normalizeRepositoryUrl(repository: NpmRegistryRepository | undefined) {
  const url =
    typeof repository === "string" ? repository : getString(repository?.url)

  return normalizeGitUrl(url)
}

function normalizeBugsUrl(bugs: NpmRegistryBugs | undefined) {
  const url = typeof bugs === "string" ? bugs : getString(bugs?.url)

  return normalizeGitUrl(url)
}

function normalizeGitUrl(url: string | undefined) {
  if (!url) {
    return
  }

  const githubShorthandMatch = url.match(/^github:([^/]+\/[^/]+)$/)

  if (githubShorthandMatch) {
    return `https://github.com/${githubShorthandMatch[1]}`
  }

  return url
    .replace(/^git\+/, "")
    .replace(/^git:\/\//, "https://")
    .replace(/^ssh:\/\/git@github\.com[:/]/, "https://github.com/")
    .replace(/^git@github\.com:/, "https://github.com/")
    .replace(/#.*$/, "")
    .replace(/\.git$/, "")
}
