import { fetchPackages } from "@/actions/fetch-packages"
import { PackageCard } from "@/components/package-card"
import type { SearchParamsProps } from "@/lib/types"

export async function PackageList({ searchParams }: SearchParamsProps) {
  const query = await searchParams?.q
  const packages = query ? await fetchPackages(query) : []

  return (
    <div className="custom-scroll flex h-full w-full overflow-scroll overflow-x-hidden rounded-sm border">
      <div className="w-full">
        {packages.map((pkg, index) => (
          <PackageCard key={pkg.name ?? index} packageData={pkg} />
        ))}
      </div>
    </div>
  )
}
