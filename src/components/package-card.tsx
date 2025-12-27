import { Star } from "lucide-react"

import type { Package } from "@/lib/types"

import { LinkTooltip } from "./link-tooltip"
import { ReadmeDialog } from "./readme-dialog"
import { Badge } from "./ui/badge"

export const PackageCard = ({ packageData }: { packageData: Package }) => (
  <div className="group relative flex w-full flex-col items-start justify-center border-border border-b px-6 pt-12 pb-6 transition-colors hover:bg-muted/30 md:pt-4">
    <p className="font-medium">
      {packageData.collected?.metadata?.name || "Unknown"}
    </p>

    <p className="text-muted-foreground">
      {packageData.collected?.metadata?.description?.replace(/#/g, " ") ||
        "No description available"}
    </p>

    <LinkTooltip
      href={
        packageData.collected?.github?.homepage ||
        packageData.collected?.metadata?.links.homepage ||
        packageData.collected?.metadata?.links.npm ||
        "/"
      }
    >
      Link
    </LinkTooltip>

    <Badge className="mt-4 flex items-center gap-x-1 bg-muted text-muted-foreground hover:text-background">
      <Star
        className="-mt-0.5 text-orange-600 dark:text-orange-500"
        size={16}
      />
      {packageData.collected?.github?.starsCount || "0"}
    </Badge>

    <ReadmeDialog className="absolute top-1 right-4 md:top-4 md:scale-100">
      {packageData.collected?.metadata?.readme || ""}
    </ReadmeDialog>
  </div>
)
