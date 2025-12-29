"use client"

import { useTheme } from "next-themes"
import {
  type CSSProperties,
  memo,
  type ReactNode,
  useCallback,
  useMemo
} from "react"
import Markdown from "react-markdown"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import {
  gruvboxDark,
  solarizedlight
} from "react-syntax-highlighter/dist/esm/styles/prism"
import rehypeRaw from "rehype-raw"
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

type ReadmeDialogProps = {
  children: string
  className?: string
}

type CodeBlockProps = {
  inline?: boolean
  className?: string
  children?: ReactNode
  style: Record<string, CSSProperties>
}

const CodeBlock = memo(
  ({ inline, className, children, style }: CodeBlockProps) => {
    if (inline || !className) {
      return <code className={className}>{children}</code>
    }

    const match = className.match(/language-(\w+)/)
    if (!match) {
      return <code className={className}>{children}</code>
    }

    return (
      <SyntaxHighlighter
        className="[&_span]:bg-transparent"
        customStyle={{ background: "transparent" }}
        language={match[1]}
        PreTag="div"
        showLineNumbers
        style={style}
      >
        {String(children).trimEnd()}
      </SyntaxHighlighter>
    )
  }
)

CodeBlock.displayName = "CodeBlock"

const ReadmeDialog = ({ children, className }: ReadmeDialogProps) => {
  const { resolvedTheme } = useTheme()

  const editorTheme = useMemo(
    () => (resolvedTheme === "dark" ? gruvboxDark : solarizedlight),
    [resolvedTheme]
  )

  const renderCode = useCallback(
    (props: Omit<CodeBlockProps, "style">) => (
      <CodeBlock {...props} style={editorTheme} />
    ),
    [editorTheme]
  )

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
      <DialogContent className="max-h-[80vh] max-w-6xl justify-center overflow-scroll rounded-sm sm:max-w-6xl">
        <DialogTitle className="sr-only">Readme</DialogTitle>
        <DialogDescription className="sr-only">Readme</DialogDescription>
        <ProseWrapper>
          <Markdown
            components={{ code: renderCode }}
            rehypePlugins={[rehypeRaw]}
            remarkPlugins={[remarkGfm]}
          >
            {children}
          </Markdown>
        </ProseWrapper>
      </DialogContent>
    </Dialog>
  )
}

export { ReadmeDialog }
