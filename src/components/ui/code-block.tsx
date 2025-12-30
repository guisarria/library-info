import { useTheme } from "next-themes"
import {
  type CSSProperties,
  memo,
  type ReactNode,
  useCallback,
  useMemo
} from "react"
import SyntaxHighlighter from "react-syntax-highlighter"
import { gruvboxDark } from "react-syntax-highlighter/dist/esm/styles/hljs"
import { solarizedlight } from "react-syntax-highlighter/dist/esm/styles/prism"

type CodeBlockSyntaxProps = {
  inline?: boolean
  className?: string
  children?: ReactNode
  style: Record<string, CSSProperties>
}

export const CodeBlockSyntax = memo(
  ({ inline, className, children, style }: CodeBlockSyntaxProps) => {
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

export const CodeBlock = () => {
  const { resolvedTheme } = useTheme()

  const editorTheme = useMemo(
    () => (resolvedTheme === "dark" ? gruvboxDark : solarizedlight),
    [resolvedTheme]
  )

  const renderCode = useCallback(
    (children: ReactNode) => (
      <CodeBlockSyntax style={editorTheme}>{children}</CodeBlockSyntax>
    ),
    [editorTheme]
  )
  return renderCode
}
