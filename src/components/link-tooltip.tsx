import { Link as LinkIcon } from "lucide-react"
import Link from "next/link"
import type { ReactNode } from "react"

import { Button } from "./ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "./ui/tooltip"

export const LinkTooltip = ({
  href,
  children,
  iconSize = 12
}: {
  href: string
  children?: ReactNode
  iconSize?: number
}) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            asChild
            className="px-0 text-muted-foreground dark:text-primary"
            variant={"link"}
          >
            <Link
              className="gap-x-1"
              href={href}
              rel="noopener noreferrer"
              target="_blank"
            >
              <LinkIcon
                className="text-cyan-600 dark:text-cyan-400"
                size={iconSize}
              />{" "}
              {children}
            </Link>
          </Button>
        </TooltipTrigger>

        <TooltipContent
          className="border border-border bg-background text-foreground"
          side="bottom"
        >
          <Button
            asChild
            className="px-0 text-muted-foreground text-sm"
            variant={"link"}
          >
            <Link
              className="gap-x-1"
              href={href}
              rel="noopener noreferrer"
              target="_blank"
            >
              {href}
            </Link>
          </Button>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
