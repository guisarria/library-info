"use client"

import { useCallback, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"

import { extractDependencyNames } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

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
    <div className="flex flex-col h-full items-center relative">
      <div className="h-full w-full relative">
        <Textarea
          value={query}
          onChange={handleTextareaChange}
          spellCheck={false}
          className="h-full w-full lg:w-[30vw] xl:w-[25vw] resize-none rounded-b-none bg-background/40 p-4 leading-relaxed tracking-wide"
          aria-label="Dependency input"
        />
        <PlaceholderIcon
          className="absolute scale-50 md:scale-100 text-xl tracking-widest top-1/2 -translate-y-1/2 text-nowrap left-1/2 -z-10 -translate-x-1/2 text-muted-foreground opacity-35 flex flex-col gap-y-4 items-center"
          isVisible={isQueryEmpty}
        />
      </div>

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
