"use server"

import type { Package } from "@/lib/types"

export async function fetchPackages(query: string) {
  const packages = query.split("\n").map((pkg) => pkg.trim())

  try {
    const response = await fetch("https://api.npms.io/v2/package/mget", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(packages),
      next: {
        revalidate: 3600
      }
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch packages: ${response.statusText}`)
    }

    const data: Record<string, Package> = await response.json()
    return Object.values(data)
  } catch (error) {
    console.error("Error fetching packages:", error)
    return []
  }
}
