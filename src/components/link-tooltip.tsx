import type { ReactNode } from "react"
import Link from "next/link"
import { Link as LinkIcon } from "lucide-react"

import { Button } from "./ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip"

export const LinkTooltip = ({
  href,
  children,
  iconSize = 12,
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
            variant={"link"}
            className="px-0 text-muted-foreground dark:text-primary"
          >
            <Link
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="gap-x-1"
            >
              <LinkIcon
                size={iconSize}
                className="text-cyan-600 dark:text-cyan-400"
              />{" "}
              {children}
            </Link>
          </Button>
        </TooltipTrigger>

        <TooltipContent
          side="bottom"
          className="border border-border bg-background text-foreground"
        >
          <Button
            asChild
            variant={"link"}
            className="px-0 text-sm text-muted-foreground"
          >
            <Link
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="gap-x-1"
            >
              {href}
            </Link>
          </Button>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
