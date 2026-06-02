"use client"

import { useRouter } from "next/navigation"
import {
  type ChangeEvent,
  type KeyboardEvent,
  useEffect,
  useState,
  useTransition
} from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"
import { parsePackageNames, serializePackageNames } from "@/lib/package-query"

import { EnterIcon, PlaceholderIcon } from "./icons"

const EXAMPLE = `
  "dependencies": {
  "@base-ui/react": "^1.0.0",
  "geist": "^1.5.1",
  "next": "16.1.1",
  "react": "^19.2.3",
  "react-dom": "19.2.3"
  }
`

type QuerySectionProps = {
  initialQuery: string
}

export function QuerySection({ initialQuery }: QuerySectionProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [query, setQuery] = useState<string>(initialQuery)
  const [inputValue, setInputValue] = useState<string>("")

  useEffect(() => {
    setQuery(initialQuery)
  }, [initialQuery])

  function commitQuery(value: string) {
    const nextQuery = serializePackageNames(parsePackageNames(value))
    const params = new URLSearchParams()

    if (nextQuery) {
      params.set("packages", nextQuery)
    }

    setQuery(nextQuery)

    startTransition(() => {
      router.push(params.size > 0 ? `?${params.toString()}` : "/", {
        scroll: false
      })
    })
  }

  function handleTextareaChange(e: ChangeEvent<HTMLTextAreaElement>) {
    setQuery(e.target.value)
  }

  function handlePackageNameChange(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key !== "Enter") {
      return
    }

    e.preventDefault()

    const newPackageName = e.currentTarget.value.trim()

    if (!newPackageName) {
      return
    }

    setInputValue("")
    commitQuery(`${query}\n${newPackageName}`)
  }

  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    setInputValue(e.target.value)
  }

  const isQueryEmpty = !query.trim()

  return (
    <div className="relative flex h-full min-h-0 w-full flex-col items-center">
      <div className="relative min-h-0 w-full flex-1 overflow-hidden rounded-sm rounded-b-none!">
        <Textarea
          aria-label="Dependency input"
          className="field-sizing-fixed h-full min-h-0 w-full resize-none overflow-y-auto rounded-sm rounded-b-none! border-b-0 bg-input/30 p-4 leading-relaxed tracking-wide focus:border-b md:text-base dark:focus:mix-blend-lighten"
          contentEditable={false}
          onChange={handleTextareaChange}
          spellCheck={false}
          value={query}
        />
        {isQueryEmpty && (
          <div className="pointer-events-none absolute top-4 right-4 left-4 select-none text-muted-foreground/60">
            <pre className="wrap-break-word whitespace-pre-wrap font-sans text-sm leading-relaxed tracking-wide md:text-base">
              {EXAMPLE}
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
          aria-busy={isPending}
          aria-label="Get package information"
          className="w-full self-center rounded-sm"
          disabled={isQueryEmpty || isPending}
          onClick={() => commitQuery(query)}
          size="lg"
          variant="outline"
        >
          {isPending && <Spinner />}
          Get Info
        </Button>
      </div>
    </div>
  )
}
