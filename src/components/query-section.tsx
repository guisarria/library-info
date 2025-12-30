"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useCallback, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { extractDependencyNames } from "@/lib/utils"

import { EnterIcon, PlaceholderIcon } from "./icons"

export function QuerySection() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [query, setQuery] = useState<string>(searchParams.get("packages") ?? "")
  const [inputValue, setInputValue] = useState<string>("")

  const example = `
    "dependencies": {
    "@base-ui/react": "^1.0.0",
    "geist": "^1.5.1",
    "next": "16.1.1",
    "react": "^19.2.3",
    "react-dom": "19.2.3"
    }
  `

  const handleTextareaChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const dependencyNames = extractDependencyNames(e.target.value)
      setQuery(dependencyNames.join("\n"))
      router.push(`?packages=${encodeURIComponent(dependencyNames.join("\n"))}`)
    },
    [router]
  )
  const handlePackageNameChange = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key !== "Enter") {
        return
      }

      const newPackageName = e.currentTarget.value.trim()
      if (!newPackageName) {
        return
      }

      const nextQuery = `${query}\n${newPackageName}`.trim()

      setQuery(nextQuery)
      setInputValue("")

      router.push(`?packages=${encodeURIComponent(nextQuery)}`)
    },
    [query, router]
  )
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(e.target.value)
    },
    []
  )

  const handleFetchPackages = useCallback(() => {
    router.push(`?packages=${encodeURIComponent(query)}`)
  }, [query, router])

  const isQueryEmpty = !query.trim()

  return (
    <div className="relative flex h-full w-full flex-col items-center">
      <div className="relative w-full flex-1 overflow-scroll rounded-sm rounded-b-none!">
        <Textarea
          aria-label="Dependency input"
          className="h-full w-full resize-none rounded-sm rounded-b-none! border-b-0 bg-input/30 p-4 leading-relaxed tracking-wide focus:border-b md:text-base dark:focus:mix-blend-lighten"
          contentEditable={false}
          onChange={handleTextareaChange}
          spellCheck={false}
          value={query}
        />
        {isQueryEmpty && (
          <div className="pointer-events-none absolute top-4 right-4 left-4 select-none text-muted-foreground/60">
            <pre className="wrap-break-word whitespace-pre-wrap font-sans text-sm leading-relaxed tracking-wide md:text-base">
              {example}
            </pre>
          </div>
        )}
        <PlaceholderIcon
          className="absolute top-1/2 left-1/2 -z-10 flex -translate-x-1/2 -translate-y-1/2 scale-50 flex-col items-center gap-y-4 text-nowrap text-muted-foreground text-xl tracking-widest opacity-35 md:scale-100"
          isVisible={isQueryEmpty}
        />
      </div>
      <div className="relative w-full">
        <Input
          aria-label="Package name input"
          className="h-12 w-full rounded-sm rounded-t-none!"
          onChange={handleInputChange}
          onKeyDown={handlePackageNameChange}
          placeholder="Write package name"
          value={inputValue}
        />
        <EnterIcon
          className="absolute top-3.5 right-4 text-muted-foreground"
          isVisible={inputValue.length > 0}
        />
      </div>
      <div className="mt-auto flex w-full gap-2 self-end pt-4 lg:w-full">
        <Button
          aria-label="Get package information"
          className="w-full self-center rounded-sm"
          disabled={isQueryEmpty}
          onClick={handleFetchPackages}
          size="lg"
          variant="outline"
        >
          Get Info
        </Button>
      </div>
    </div>
  )
}
