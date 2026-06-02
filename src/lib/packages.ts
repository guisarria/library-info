import { cacheLife, cacheTag } from "next/cache"
import { parsePackageNames } from "@/lib/package-query"
import type { Package } from "@/lib/types"

const NPMS_PACKAGE_ENDPOINT = "https://api.npms.io/v2/package/mget"
const MAX_PACKAGES_PER_LOOKUP = 50

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
  const response = await fetch(NPMS_PACKAGE_ENDPOINT, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(packageNames)
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch packages: ${response.statusText}`)
  }

  const data = (await response.json()) as Record<string, Package | undefined>

  return packageNames.flatMap((packageName) => {
    const packageData = data[packageName]

    if (!packageData) {
      return []
    }

    return [
      {
        ...packageData,
        name:
          packageData.name ??
          packageData.collected?.metadata?.name ??
          packageName
      }
    ]
  })
}
