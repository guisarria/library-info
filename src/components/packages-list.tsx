import type { Package } from "@/lib/types"
import { PackageInfo } from "@/components/package-info"

interface PackageListProps {
  packages: Package[]
}

export function PackageList({ packages }: PackageListProps) {
  return (
    <div className="custom-scroll flex h-full w-full overflow-scroll overflow-x-hidden rounded-sm border">
      <div className="w-full">
        {packages.map((pkg, index) => (
          <PackageInfo key={index} packageData={pkg} />
        ))}
      </div>
    </div>
  )
}
