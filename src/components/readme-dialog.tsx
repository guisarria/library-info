"use client"

import { CheckCheckIcon, CopyIcon } from "lucide-react"
import { useTheme } from "next-themes"
import { memo, type ReactNode, useCallback, useState } from "react"
import Markdown from "react-markdown"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import {
  gruvboxDark,
  solarizedlight
} from "react-syntax-highlighter/dist/esm/styles/prism"
import rehypeRaw from "rehype-raw"
import rehypeSanitize from "rehype-sanitize"
import remarkGfm from "remark-gfm"
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

type ReadmeDialogProps = {
  children: string
  className?: string
}

type CodeBlockProps = {
  inline?: boolean
  className?: string
  children?: ReactNode
}

const CodeBlock = memo(({ inline, className, children }: CodeBlockProps) => {
  const { resolvedTheme } = useTheme()
  const [copied, setCopied] = useState(false)
  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(String(children))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [children])

  const themeStyle = resolvedTheme === "dark" ? gruvboxDark : solarizedlight

  if (inline || !className) {
    return (
      <code className="rounded bg-muted/80 p-0.5 font-medium font-mono text-sm">
        {children}
      </code>
    )
  }

  const match = className.match(/language-(\w+)/)

  if (!match) {
    return (
      <code className="block bg-muted p-4 font-mono text-sm">{children}</code>
    )
  }

  const language = match[1]

  return (
    <div>
      <div className="flex items-center justify-between border-b bg-muted/30 px-4 py-2">
        <span className="text-muted-foreground text-xs uppercase">
          {language}
        </span>
        <Button onClick={handleCopy} size="sm" variant="ghost">
          {copied ? (
            <CheckCheckIcon className="text-muted-foreground" />
          ) : (
            <CopyIcon className="text-muted-foreground" />
          )}
        </Button>
      </div>
      <SyntaxHighlighter
        className="[&_span]:bg-transparent"
        customStyle={{ background: "transparent", padding: "1rem" }}
        language={language}
        PreTag="div"
        showLineNumbers
        style={themeStyle}
      >
        {String(children).trimEnd()}
      </SyntaxHighlighter>
    </div>
  )
})

type MarkdownContentProps = {
  content: string
}

const MarkdownContent = memo(({ content }: MarkdownContentProps) => {
  const renderCode = useCallback(
    (props: Omit<CodeBlockProps, "style">) => <CodeBlock {...props} />,
    []
  )
  return (
    <Markdown
      components={{ code: renderCode }}
      rehypePlugins={[rehypeRaw, rehypeSanitize]}
      remarkPlugins={[remarkGfm]}
    >
      {content}
    </Markdown>
  )
})

const ReadmeDialog = ({ children, className }: ReadmeDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button
            className={cn(className)}
            disabled={!children}
            variant="outline"
          >
            Readme
          </Button>
        }
      />
      <DialogContent className="flex max-w-6xl flex-col items-center justify-center rounded-sm p-0 sm:max-w-6xl">
        <DialogTitle className="sr-only">Readme</DialogTitle>
        <DialogDescription className="sr-only">Readme</DialogDescription>
        <ScrollArea
          className="mx-auto flex max-h-[80vh] flex-col items-center justify-center"
          scrollFade
        >
          <ProseWrapper>
            <MarkdownContent content={children} />
          </ProseWrapper>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

export { ReadmeDialog }
