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
  const [query, setQuery] = useState<string>(searchParams.get("q") ?? "")
  const [inputValue, setInputValue] = useState<string>("")

  const handleTextareaChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const dependencyNames = extractDependencyNames(e.target.value)
      setQuery(dependencyNames.join("\n"))
    },
    []
  )

  const handlePackageNameChange = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      const newPackageName = e.currentTarget.value.trim()
      if (newPackageName && e.key === "Enter") {
        setQuery((prev) => `${prev}\n${newPackageName}`.trim())
        setInputValue("")
      }
    },
    []
  )

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(e.target.value)
    },
    []
  )

  const handleFetchPackages = useCallback(() => {
    router.push(`?q=${encodeURIComponent(query)}`)
  }, [query, router])

  const isQueryEmpty = !query.trim()

  return (
    <div className="relative flex h-full flex-col items-center">
      <div className="relative h-full w-full">
        <Textarea
          aria-label="Dependency input"
          className="h-full w-full resize-none rounded-b-none bg-background/40 p-4 leading-relaxed tracking-wide lg:w-[30vw] xl:w-[25vw]"
          onChange={handleTextareaChange}
          spellCheck={false}
          value={query}
        />
        <PlaceholderIcon
          className="absolute top-1/2 left-1/2 -z-10 flex -translate-x-1/2 -translate-y-1/2 scale-50 flex-col items-center gap-y-4 text-nowrap text-muted-foreground text-xl tracking-widest opacity-35 md:scale-100"
          isVisible={isQueryEmpty}
        />
      </div>

      <div className="relative w-full">
        <Input
          aria-label="Package name input"
          className="-mt-[1px] h-12 w-full rounded-t-none bg-background/40"
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

      <Button
        aria-label="Get package information"
        className="-bottom-20 mt-6 -mb-5 w-1/3 self-center py-5 disabled:border-neutral-700 lg:absolute lg:my-0"
        disabled={isQueryEmpty}
        onClick={handleFetchPackages}
        size="lg"
        variant="outline"
      >
        Get Info
      </Button>
    </div>
  )
}
