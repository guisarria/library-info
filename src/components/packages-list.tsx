import { fetchPackages } from "@/actions/fetch-packages"
import { PackageCard } from "@/components/package-card"
import type { SearchParamsProps } from "@/lib/types"

export async function PackageList({ searchParams }: SearchParamsProps) {
  const resolvedSearchParams = await searchParams
  const query = resolvedSearchParams?.q
  const packages = query ? await fetchPackages(query) : []

  return (
    <div className="custom-scroll">
      <div className="w-full">
        {packages.map((pkg, index) => (
          <PackageCard key={pkg.name ?? index} packageData={pkg} />
        ))}
      </div>
    </div>
  )
}
