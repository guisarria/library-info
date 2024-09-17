"use client"

import { useCallback, useState } from "react"
import { fetchPackages } from "@/actions/fetch-packages"

import type { Package } from "@/lib/types"
import { extractDependencyNames } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

import { EnterIcon, PlaceholderIcon } from "./icons"

interface QuerySectionProps {
  onFetchPackages: (packages: Package[]) => void
}

export function QuerySection({ onFetchPackages }: QuerySectionProps) {
  const [query, setQuery] = useState<string>("")
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

  const handleFetchPackages = useCallback(async () => {
    const packages = await fetchPackages(query)
    onFetchPackages(packages)
  }, [query, onFetchPackages])

  const isQueryEmpty = !query.trim()

  return (
    <div className="flex flex-col h-full items-center relative">
      <Textarea
        value={query}
        onChange={handleTextareaChange}
        spellCheck={false}
        className="h-full w-full lg:w-[30vw] xl:w-[25vw] resize-none rounded-b-none bg-background/40 p-4 leading-relaxed tracking-wide"
        aria-label="Dependency input"
      />
      <PlaceholderIcon
        className="absolute text-xl tracking-widest top-4 lg:top-1/4 text-nowrap left-1/2 -z-10 -translate-x-1/2 text-muted-foreground opacity-35 flex flex-col gap-y-4 items-center"
        isVisible={isQueryEmpty}
      />
      <div className="w-full relative">
        <Input
          placeholder="Write package name"
          onKeyDown={handlePackageNameChange}
          onChange={handleInputChange}
          value={inputValue}
          aria-label="Package name input"
          className="rounded-t-none bg-background/40 h-12 -mt-[1px] w-full"
        />
        <EnterIcon
          isVisible={inputValue.length > 0}
          className="text-muted-foreground absolute right-4 top-3.5"
        />
      </div>
      <Button
        variant="outline"
        size="lg"
        onClick={handleFetchPackages}
        disabled={isQueryEmpty}
        className="w-1/3 lg:absolute -bottom-20 py-5 -mb-5 mt-6 lg:my-0 self-center disabled:border-neutral-700"
        aria-label="Get package information"
      >
        Get Info
      </Button>
    </div>
  )
}
