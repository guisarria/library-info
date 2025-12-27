import { Suspense } from "react"
import { PackageList } from "@/components/packages-list"
import { QuerySection } from "@/components/query-section"
import type { SearchParamsProps } from "@/lib/types"

export default async function Home({ searchParams }: SearchParamsProps) {
  return (
    <div className="container mx-auto flex h-full w-full flex-col items-center gap-6 pt-8 lg:flex-row lg:gap-8">
      <div className="flex h-full w-full flex-1">
        <Suspense
          fallback={<div className="h-full w-full border-input bg-input/30" />}
        >
          <QuerySection />
        </Suspense>
      </div>
      <div className="flex h-full w-full flex-1 flex-col overflow-scroll rounded-sm border border-input bg-input/30 lg:w-1/3">
        <Suspense>
          <PackageList searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  )
}
