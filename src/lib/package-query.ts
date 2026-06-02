const DEPENDENCY_FIELDS = [
  "dependencies",
  "devDependencies",
  "peerDependencies",
  "optionalDependencies"
] as const

type PackageJsonLike = {
  [key in (typeof DEPENDENCY_FIELDS)[number]]?: Record<string, unknown>
}

const DEPENDENCY_BLOCK_PATTERN =
  /"(dependencies|devDependencies|peerDependencies|optionalDependencies)"\s*:\s*\{([\s\S]*?)\}/g

const PACKAGE_ENTRY_PATTERN = /"([^"]+)"\s*:/g

const PACKAGE_NAME_PATTERN =
  /^(?:@[a-z0-9][a-z0-9._-]*\/)?[a-z0-9][a-z0-9._~-]*$/i

export function getPackageQueryValue(value: string | string[] | undefined) {
  if (Array.isArray(value)) {
    return serializePackageNames(
      value.flatMap((item) => parsePackageNames(item))
    )
  }

  return value ?? ""
}

export function parsePackageNames(input: string) {
  const jsonNames = parsePackageJsonDependencyNames(input)

  if (jsonNames.length > 0) {
    return uniquePackageNames(jsonNames)
  }

  const dependencyBlockNames = parseDependencyBlockNames(input)

  if (dependencyBlockNames.length > 0) {
    return uniquePackageNames(dependencyBlockNames)
  }

  return uniquePackageNames(
    input
      .split(/[\n,]+/)
      .map(cleanPackageToken)
      .filter(isPackageName)
  )
}

export function serializePackageNames(names: readonly string[]) {
  return uniquePackageNames(names).join("\n")
}

function parsePackageJsonDependencyNames(input: string) {
  const candidates = [input, `{${input}}`]

  for (const candidate of candidates) {
    try {
      const parsed = JSON.parse(candidate) as PackageJsonLike

      return DEPENDENCY_FIELDS.flatMap((field) => {
        const dependencies = parsed[field]
        return dependencies ? Object.keys(dependencies) : []
      })
    } catch {
      //
    }
  }

  return []
}

function parseDependencyBlockNames(input: string) {
  return [...input.matchAll(DEPENDENCY_BLOCK_PATTERN)].flatMap((block) =>
    [...block[2].matchAll(PACKAGE_ENTRY_PATTERN)].map((entry) => entry[1])
  )
}

function cleanPackageToken(token: string) {
  const value = token
    .trim()
    .replace(/^["'`]+/, "")
    .replace(/["'`,;]+$/, "")
    .trim()

  const specifierMatch = value.match(/^((?:@[^/\s]+\/)?[^@\s]+)@.+$/)

  return specifierMatch?.[1] ?? value
}

function isPackageName(value: string) {
  return PACKAGE_NAME_PATTERN.test(value)
}

function uniquePackageNames(names: readonly string[]) {
  const seen = new Set<string>()

  return names.reduce<string[]>((result, name) => {
    const normalizedName = cleanPackageToken(name)

    if (!isPackageName(normalizedName) || seen.has(normalizedName)) {
      return result
    }

    seen.add(normalizedName)
    result.push(normalizedName)

    return result
  }, [])
}
