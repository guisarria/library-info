import { Skeleton } from "@/components/ui/skeleton"

const SKELETON_ROWS = ["first", "second", "third", "fourth"] as const

export function PackageListSkeleton() {
  return (
    <div className="w-full">
      {SKELETON_ROWS.map((row) => (
        <div
          className="flex min-h-36 w-full flex-col gap-4 border-border border-b px-6 py-6"
          key={row}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-1 flex-col gap-3">
              <Skeleton className="h-5 w-40 rounded-sm" />
              <Skeleton className="h-4 w-full rounded-sm" />
              <Skeleton className="h-4 w-2/3 rounded-sm" />
            </div>
            <Skeleton className="h-8 w-20 rounded-sm" />
          </div>
          <div className="flex items-center gap-3">
            <Skeleton className="h-5 w-16 rounded-sm" />
            <Skeleton className="h-5 w-24 rounded-sm" />
          </div>
        </div>
      ))}
    </div>
  )
}
