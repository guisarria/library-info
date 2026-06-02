import { PackageListSkeleton } from "@/components/package-list-skeleton"
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="container mx-auto grid h-full min-h-0 w-full grid-cols-1 grid-rows-[minmax(18rem,0.8fr)_minmax(0,1fr)] gap-6 lg:grid-cols-2 lg:grid-rows-1">
      <div className="flex min-h-0 w-full flex-col">
        <Skeleton className="min-h-0 w-full flex-1 rounded-sm rounded-b-none!" />
        <Skeleton className="h-12 w-full rounded-sm rounded-t-none!" />
        <Skeleton className="mt-4 h-9 w-full rounded-sm" />
      </div>
      <div className="h-full min-h-0 w-full overflow-hidden rounded-sm border border-input bg-input/30">
        <PackageListSkeleton />
      </div>
    </div>
  )
}
