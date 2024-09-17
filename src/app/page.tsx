"use client"

import { useState } from "react"

import type { Package } from "@/lib/types"
import { PackageList } from "@/components/packages-list"
import { QuerySection } from "@/components/query-section"

export default function Home() {
  const [results, setResults] = useState<Package[]>([])

  return (
    <div className="flex h-full w-full mb-4 lg:mb-14 justify-between gap-8 gap-y-12 p-12 2xl:px-60 flex-col lg:flex-row">
      <QuerySection onFetchPackages={setResults} />
      <PackageList packages={results} />
    </div>
  )
}
