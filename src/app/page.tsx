
import { PackageList } from "@/components/packages-list"
import { QuerySection } from "@/components/query-section"
import { SearchParamsProps } from "@/lib/types"

export default async function Home({ searchParams }: SearchParamsProps) {
  return (
    <div className="flex h-full w-full mb-4 lg:mb-14 justify-between gap-8 gap-y-12 p-12 2xl:px-60 flex-col lg:flex-row">
      <QuerySection />
      <PackageList searchParams={searchParams} />
    </div>
  )
}
