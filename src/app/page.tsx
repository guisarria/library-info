import { Suspense } from "react"
import { PackageList } from "@/components/packages-list"
import { QuerySection } from "@/components/query-section"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { SearchParamsProps } from "@/lib/types"

export default async function Home({ searchParams }: SearchParamsProps) {
  return (
    <div className="container mx-auto flex h-full w-full flex-col items-center gap-6 pt-8 lg:flex-row lg:gap-8">
      <div className="flex h-full w-full flex-1">
        <Suspense
          fallback={
            <div className="h-full w-full rounded-sm border border-input bg-input/30" />
          }
        >
          <QuerySection />
        </Suspense>
      </div>
      <Suspense
        fallback={
          <div className="flex h-full max-h-[40vh] w-full flex-1 rounded-sm border border-input bg-input/30 lg:max-h-[90vh]" />
        }
      >
        <ScrollArea
          className={
            "flex h-full max-h-[40vh] w-full flex-1 flex-col rounded-sm border border-input bg-input/30 lg:max-h-[90vh] lg:w-1/3"
          }
          scrollFade
        >
          <PackageList searchParams={searchParams} />
        </ScrollArea>
      </Suspense>
    </div>
  )
}
