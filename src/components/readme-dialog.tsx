"use client"

import { lazy, Suspense } from "react"
import { cn } from "@/lib/utils"
import { ProseWrapper } from "./prose-wrapper"
import { Button } from "./ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger
} from "./ui/dialog"
import { ScrollArea } from "./ui/scroll-area"
import { Skeleton } from "./ui/skeleton"

type ReadmeDialogProps = {
  className?: string
  packageName: string
  readme: string
}

const ReadmeMarkdown = lazy(() =>
  import("./readme-markdown").then((module) => ({
    default: module.ReadmeMarkdown
  }))
)

const ReadmeDialog = ({
  className,
  packageName,
  readme
}: ReadmeDialogProps) => (
  <Dialog>
    <DialogTrigger
      render={
        <Button className={cn(className)} disabled={!readme} variant="outline">
          Readme
        </Button>
      }
    />
    <DialogContent className="flex max-w-6xl flex-col items-center justify-center rounded-sm p-0 sm:max-w-6xl">
      <DialogTitle className="sr-only">{packageName} readme</DialogTitle>
      <DialogDescription className="sr-only">
        Package readme content
      </DialogDescription>
      <ScrollArea
        className="mx-auto flex max-h-[80vh] flex-col items-center justify-center"
        scrollFade
      >
        <ProseWrapper>
          <Suspense fallback={<ReadmeSkeleton />}>
            <ReadmeMarkdown content={readme} />
          </Suspense>
        </ProseWrapper>
      </ScrollArea>
    </DialogContent>
  </Dialog>
)

export { ReadmeDialog }

function ReadmeSkeleton() {
  return (
    <div className="flex w-full min-w-80 flex-col gap-3 p-6">
      <Skeleton className="h-5 w-48 rounded-sm" />
      <Skeleton className="h-4 w-full rounded-sm" />
      <Skeleton className="h-4 w-5/6 rounded-sm" />
      <Skeleton className="h-32 w-full rounded-sm" />
    </div>
  )
}
