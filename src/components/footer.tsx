import Link from "next/link"

import { ThemeToggle } from "./theme-toggle"

const Footer = () => {
  return (
    <footer className="flex self-end h-[4vh] w-full items-center justify-end border-t border-border px-4 pt-2">
      <div className="flex w-full items-center justify-center">
        <p className="text-xs text-muted-foreground">
          Made by{" "}
          <Link href={"https://github.com/guisarria"}>Guilherme Sarria</Link>
        </p>
      </div>
      <ThemeToggle />
    </footer>
  )
}

export { Footer }
