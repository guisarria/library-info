import { Suspense } from "react"
import { PackageList } from "@/components/packages-list"
import { QuerySection } from "@/components/query-section"
import { SearchParamsProps } from "@/lib/types"

export default async function Home({ searchParams }: SearchParamsProps) {
  return (
    <div className="flex h-full w-full mb-4 lg:mb-14 justify-between gap-8 gap-y-12 p-12 2xl:px-60 flex-col lg:flex-row">
      <Suspense fallback={<QuerySectionSkeleton />}>
        <QuerySection />
      </Suspense>

      <PackageList searchParams={searchParams} />
    </div>
  )
}

function QuerySectionSkeleton() {
  return (
    <div className="flex flex-col h-full items-center relative animate-pulse">
      <div className="h-full w-full lg:w-[30vw] xl:w-[25vw] bg-muted rounded-t" />
      <div className="w-full h-12 bg-muted rounded-b" />
      <div className="w-1/3 h-12 bg-muted rounded mt-6 lg:absolute lg:-bottom-20" />
    </div>
  )
}
