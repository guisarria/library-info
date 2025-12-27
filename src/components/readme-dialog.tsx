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
      <DialogTrigger asChild>
        <Button className={className} disabled={!children} variant="outline">
          Readme
        </Button>
      </DialogTrigger>

      <DialogContent className="flex max-h-[600px] max-w-5xl flex-col items-center overflow-auto border px-12 md:max-h-[720px]">
        <DialogTitle className="sr-only">Readme</DialogTitle>
        <DialogDescription className="sr-only">Readme</DialogDescription>
        <ProseWrapper>
          <Markdown
            // biome-ignore lint/correctness/noChildrenProp: noChildrenProp
            children={children}
            components={{ code: renderCode }}
            rehypePlugins={[rehypeRaw]}
          />
        </ProseWrapper>
      </DialogContent>
    </Dialog>
  )
}

export { ReadmeDialog }
