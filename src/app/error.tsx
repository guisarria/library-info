"use client"

import { RotateCcwIcon, TriangleAlertIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function RouteError({
  error,
  reset
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="container mx-auto flex h-full min-h-0 w-full items-center justify-center">
      <div className="flex max-w-md flex-col items-center gap-4 rounded-sm border border-input bg-input/30 p-8 text-center">
        <div className="flex size-10 items-center justify-center rounded-sm bg-destructive/10 text-destructive">
          <TriangleAlertIcon />
        </div>
        <div className="space-y-2">
          <h2 className="font-medium text-lg">Package lookup failed</h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {error.message || "The package registry request did not complete."}
          </p>
        </div>
        <Button onClick={reset} variant="outline">
          <RotateCcwIcon />
          Try again
        </Button>
      </div>
    </div>
  )
}
