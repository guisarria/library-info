import Link from "next/link"

import { ThemeToggle } from "./theme-toggle"

const Footer = () => {
  return (
    <footer className="container mx-auto flex w-full items-center justify-center rounded-sm rounded-b-none! border border-b-0 bg-input/30 p-4">
      <div className="container flex h-full w-full items-center justify-between">
        <div className="flex items-center justify-center">
          <p className="text-muted-foreground text-xs">
            Made by{" "}
            <Link
              className="hover:underline"
              href={"https://github.com/guisarria"}
            >
              Guilherme Sarria
            </Link>
          </p>
        </div>

        <ThemeToggle />
      </div>
    </footer>
  )
}

export { Footer }
