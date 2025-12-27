import { Suspense } from "react"
import { fetchPackages } from "@/actions/fetch-packages"
import { PackageCard } from "@/components/package-card"
import type { SearchParamsProps } from "@/lib/types"

export async function PackageList({ searchParams }: SearchParamsProps) {
  const resolvedSearchParams = await searchParams
  const query = resolvedSearchParams?.packages
  const packages = query ? await fetchPackages(query) : []

  return (
    <div>
      <div className="max-h-[80vh] w-full">
        {packages.map((pkg, index) => (
          <Suspense key={pkg.name ?? index}>
            <PackageCard packageData={pkg} />
          </Suspense>
        ))}
      </div>
    </div>
  )
}
