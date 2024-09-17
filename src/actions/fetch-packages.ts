"use server"

import { Package } from "@/lib/types"

export async function fetchPackages(query: string) {
  const packages = query.split("\n").map((pkg) => pkg.trim())

  const response = await fetch("https://api.npms.io/v2/package/mget", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(packages),
  })

  if (!response.ok) {
    throw new Error("Failed to fetch packages")
  }

  const data: Record<string, Package> = await response.json()
  console.log(data)
  return Object.values(data)
}