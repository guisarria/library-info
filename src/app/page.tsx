import { Suspense } from "react"
import { PackageListSkeleton } from "@/components/package-list-skeleton"
import { PackageList } from "@/components/packages-list"
import { QuerySection } from "@/components/query-section"
import { ScrollArea } from "@/components/ui/scroll-area"
import { getPackageQueryValue } from "@/lib/package-query"
import type { SearchParamsProps } from "@/lib/types"

export default async function Home({ searchParams }: SearchParamsProps) {
  const query = getPackageQueryValue((await searchParams).packages)

  return (
    <div className="container mx-auto grid h-full min-h-0 w-full grid-cols-1 grid-rows-[minmax(18rem,0.8fr)_minmax(0,1fr)] gap-6 lg:grid-cols-2 lg:grid-rows-1">
      <div className="flex min-h-0 w-full">
        <QuerySection initialQuery={query} />
      </div>
      <ScrollArea
        className={
          "h-full min-h-0 w-full rounded-sm border border-input bg-input/30"
        }
        scrollFade
      >
        <Suspense fallback={<PackageListSkeleton />} key={query}>
          <PackageList query={query} />
        </Suspense>
      </ScrollArea>
    </div>
  )
}
