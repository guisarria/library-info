"use client"

import { useTheme } from "next-themes"
import { type ReactNode, useMemo } from "react"
import Markdown from "react-markdown"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import {
  gruvboxDark,
  solarizedlight
} from "react-syntax-highlighter/dist/esm/styles/prism"
import rehypeRaw from "rehype-raw"

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

const ReadmeDialog = ({ children, className }: ReadmeDialogProps) => {
  const { resolvedTheme } = useTheme()
  const editorTheme = useMemo(
    () => (resolvedTheme === "dark" ? gruvboxDark : solarizedlight),
    [resolvedTheme]
  )

  const renderCode = ({
    inline,
    className,
    children,
    ...props
  }: {
    inline?: boolean
    className?: string
    children?: ReactNode
  }) => {
    const match = /language-(\w+)/.exec(className || "")
    return !inline && match ? (
      <SyntaxHighlighter
        customStyle={{ background: "transparent" }}
        language={match[1]}
        PreTag="div"
        style={editorTheme}
        {...props}
        className="[&_span]:bg-transparent"
        showLineNumbers
      >
        {String(children).replace(/\n$/, "")}
      </SyntaxHighlighter>
    ) : (
      <code className={className} {...props}>
        {children}
      </code>
    )
  }

  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button
            className={cn(className, "")}
            disabled={!children}
            variant="outline"
          >
            Readme
          </Button>
        }
      />

      <DialogContent className="flex max-h-[600px] max-w-6xl justify-center overflow-auto border p-0 px-12 pt-4 sm:max-w-6xl md:max-h-[720px]">
        <DialogTitle className="sr-only">Readme</DialogTitle>
        <DialogDescription className="sr-only">Readme</DialogDescription>
        <ProseWrapper>
          <Markdown
            components={{ code: renderCode }}
            rehypePlugins={[rehypeRaw]}
          >
            {children}
          </Markdown>
        </ProseWrapper>
      </DialogContent>
    </Dialog>
  )
}

export { ReadmeDialog }
