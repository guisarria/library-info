import { Star } from "lucide-react"

import type { Package } from "@/lib/types"

import { LinkTooltip } from "./link-tooltip"
import { ReadmeDialog } from "./readme-dialog"
import { Badge } from "./ui/badge"

export const PackageInfo = ({ packageData }: { packageData: Package }) => (
  <div className="relative flex w-full flex-col items-start justify-center border-b border-border px-6 pb-6 pt-4">
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
        size={16}
        className="-mt-0.5 text-orange-600 dark:text-orange-500"
      />
      {packageData.collected?.github?.starsCount || "0"}
    </Badge>

    <ReadmeDialog className="absolute right-4 md:top-4 top-1 scale-75 md:scale-100">
      {packageData.collected?.metadata?.readme || ""}
    </ReadmeDialog>
  </div>
)
