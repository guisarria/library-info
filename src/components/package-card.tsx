import { Star } from "lucide-react"

import type { Package } from "@/lib/types"
import { ReadmeDialog } from "./readme-dialog"
import { ReadmeMarkdown } from "./readme-markdown"
import { Badge } from "./ui/badge"
import { LinkPreview } from "./ui/link-preview"

export const PackageCard = ({ packageData }: { packageData: Package }) => {
  const metadata = packageData.collected?.metadata
  const packageName = metadata?.name ?? packageData.name ?? "Unknown"
  const description = metadata?.description ?? "No description available."
  const starsCount = packageData.collected?.github?.starsCount ?? 0
  const href = getPackageHref(packageData)

  return (
    <div className="group relative flex w-full flex-col items-start justify-center border-border border-b px-6 pt-6 pb-6 transition-colors hover:bg-muted/30">
      <p className="mb-2 font-medium">{packageName}</p>

      <div className="mb-4 text-muted-foreground text-sm leading-relaxed">
        <ReadmeMarkdown content={description} />
      </div>

      {href && (
        <LinkPreview
          className="flex items-center gap-x-1 font-medium text-sm no-underline"
          href={href}
        >
          Link
        </LinkPreview>
      )}

      <Badge className="mt-4 flex items-center gap-x-1 bg-muted text-muted-foreground">
        <Star
          className="-mt-0.5 text-orange-600 dark:text-orange-500"
          size={16}
        />
        {formatStars(starsCount)}
      </Badge>

      <ReadmeDialog
        className="absolute top-4 right-4 md:scale-100"
        packageName={packageName}
        readme={metadata?.readme ?? ""}
      />
    </div>
  )
}

function getPackageHref(packageData: Package) {
  const metadata = packageData.collected?.metadata
  const packageName = metadata?.name ?? packageData.name

  return (
    packageData.collected?.github?.homepage ??
    metadata?.links.homepage ??
    metadata?.links.repository ??
    metadata?.links.npm ??
    (packageName ? `https://www.npmjs.com/package/${packageName}` : undefined)
  )
}

function formatStars(starsCount: number) {
  return new Intl.NumberFormat("en", {
    maximumFractionDigits: 1,
    notation: "compact"
  }).format(starsCount)
}
