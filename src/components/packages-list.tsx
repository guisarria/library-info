import { InboxIcon, SearchXIcon } from "lucide-react"
import { PackageCard } from "@/components/package-card"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle
} from "@/components/ui/empty"
import { fetchPackages } from "@/lib/packages"

type PackageListProps = {
  query: string
}

export async function PackageList({ query }: PackageListProps) {
  const packages = query ? await fetchPackages(query) : []

  if (!query.trim()) {
    return (
      <PackageListEmpty
        description="Package metadata will appear here."
        icon={<InboxIcon />}
        title="No packages selected"
      />
    )
  }

  if (packages.length === 0) {
    return (
      <PackageListEmpty
        description="Check the package names and try again."
        icon={<SearchXIcon />}
        title="No packages found"
      />
    )
  }

  return (
    <div className="w-full">
      {packages.map((pkg) => (
        <PackageCard key={pkg.name} packageData={pkg} />
      ))}
    </div>
  )
}

function PackageListEmpty({
  description,
  icon,
  title
}: {
  description: string
  icon: React.ReactNode
  title: string
}) {
  return (
    <Empty className="min-h-full border-0">
      <EmptyHeader>
        <EmptyMedia variant="icon">{icon}</EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
    </Empty>
  )
}
