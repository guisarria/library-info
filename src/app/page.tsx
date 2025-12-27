import { Suspense } from "react"
import { PackageList } from "@/components/packages-list"
import { QuerySection } from "@/components/query-section"
import type { SearchParamsProps } from "@/lib/types"

export default async function Home({ searchParams }: SearchParamsProps) {
  const resolvedSearchParams = await searchParams

  return (
    <div className="mb-4 flex h-full w-full flex-col justify-between gap-8 gap-y-12 p-12 lg:mb-14 lg:flex-row 2xl:px-60">
      <Suspense>
        <QuerySection />
      </Suspense>

      <Suspense>
        <PackageList searchParams={resolvedSearchParams} />
      </Suspense>
    </div>
  )
}

function QuerySectionSkeleton() {
  return (
    <div className="relative flex h-full animate-pulse flex-col items-center">
      <div className="h-full w-full rounded-t bg-muted lg:w-[30vw] xl:w-[25vw]" />
      <div className="h-12 w-full rounded-b bg-muted" />
      <div className="mt-6 h-12 w-1/3 rounded bg-muted lg:absolute lg:-bottom-20" />
    </div>
  )
}
