import { useMemo, type ReactNode } from "react"
import { useTheme } from "next-themes"
import Markdown from "react-markdown"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import {
  gruvboxDark,
  solarizedlight,
} from "react-syntax-highlighter/dist/esm/styles/prism"
import rehypeRaw from "rehype-raw"

import { ProseWrapper } from "./prose-wrapper"
import { Button } from "./ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog"

interface ReadmeDialogProps {
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
        style={editorTheme}
        PreTag="div"
        customStyle={{ background: "transparent" }}
        language={match[1]}
        {...props}
        showLineNumbers
        className="[&_span]:bg-transparent"
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
        <Button variant="outline" disabled={!children} className={className}>
          Readme
        </Button>
      </DialogTrigger>
      <DialogContent className="flex border max-w-5xl flex-col items-center overflow-auto px-12 max-h-[600px] md:max-h-[720px]">
        <DialogTitle className="sr-only">Readme</DialogTitle>
        <DialogDescription className="sr-only">Readme</DialogDescription>
        <ProseWrapper>
          <Markdown
            rehypePlugins={[rehypeRaw]}
            className="flex flex-col justify-center"
            components={{ code: renderCode }}
          >
            {children}
          </Markdown>
        </ProseWrapper>
      </DialogContent>
    </Dialog>
  )
}

export { ReadmeDialog }
