import Link from "next/link"

import { ThemeToggle } from "./theme-toggle"

const Footer = () => {
  return (
    <footer className="flex h-[4vh] w-full items-center justify-end self-end border-border border-t px-4 pt-2">
      <div className="flex w-full items-center justify-center">
        <p className="text-muted-foreground text-xs">
          Made by{" "}
          <Link href={"https://github.com/guisarria"}>Guilherme Sarria</Link>
        </p>
      </div>

      <ThemeToggle />
    </footer>
  )
}

export { Footer }
