import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

export const ProseWrapper = ({ children }: { children: ReactNode }) => {
  return (
    <div
      className={cn(
        // General Prose
        "prose prose-neutral dark:prose-invert w-full font-sans prose:font-sans",
        // Prose Headings
        "prose-headings:font-normal",
        // Prose Paragraphs
        "prose-p:mb-0",
        // Prose Strong
        "prose-strong:font-semibold",
        // Prose Images
        "prose-img: prose-img:m-2",
        // Inline Links
        "prose-a:text-foreground/75 prose-a:underline prose-a:decoration-primary/50 prose-a:underline-offset-2 prose-a:transition-all",
        // Inline Link Hover
        "hover:prose-a:text-foreground hover:prose-a:decoration-primary",
        // Blockquotes
        "prose-blockquote:not-italic",
        // Pre and Code Blocks
        "prose-pre:border prose-pre:bg-muted/25 prose-pre:text-primary"
      )}
    >
      {children}
    </div>
  )
}
