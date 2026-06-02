"use client"

import { CheckCheckIcon, CopyIcon } from "lucide-react"
import { useTheme } from "next-themes"
import { type ReactNode, useState } from "react"
import Markdown from "react-markdown"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import {
  gruvboxDark,
  solarizedlight
} from "react-syntax-highlighter/dist/esm/styles/prism"
import rehypeRaw from "rehype-raw"
import rehypeSanitize from "rehype-sanitize"
import remarkGfm from "remark-gfm"
import { Button } from "./ui/button"

type ReadmeMarkdownProps = {
  content: string
  hideImages?: boolean
}

type CodeBlockProps = {
  children?: ReactNode
  className?: string
  inline?: boolean
}

export function ReadmeMarkdown({ content, hideImages }: ReadmeMarkdownProps) {
  return (
    <Markdown
      components={{ code: CodeBlock }}
      disallowedElements={hideImages ? ["img"] : []}
      rehypePlugins={[rehypeRaw, rehypeSanitize]}
      remarkPlugins={[remarkGfm]}
    >
      {content}
    </Markdown>
  )
}

function CodeBlock({ children, className, inline }: CodeBlockProps) {
  const { resolvedTheme } = useTheme()
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    await navigator.clipboard.writeText(String(children))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

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
        <Button
          aria-label="Copy code"
          onClick={handleCopy}
          size="sm"
          variant="ghost"
        >
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
}
