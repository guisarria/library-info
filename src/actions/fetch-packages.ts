import { cacheLife, cacheTag } from "next/cache"
import { cache } from "react"
import type { Package } from "@/lib/types"

async function fetchPackagesUncached(query: string) {
  const packages = query.split("\n").map((pkg) => pkg.trim())

  const response = await fetch("https://api.npms.io/v2/package/mget", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(packages)
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch packages: ${response.statusText}`)
  }

  const data: Record<string, Package> = await response.json()
  return Object.values(data)
}

const fetchPackagesBase = cache(async (query: string) => {
  try {
    return await fetchPackagesUncached(query)
  } catch (error) {
    console.error("Error fetching packages:", error)
    return []
  }
})

export async function fetchPackages(query: string) {
  "use cache"
  cacheLife("hours")
  cacheTag("packages")

  return await fetchPackagesBase(query)
}
