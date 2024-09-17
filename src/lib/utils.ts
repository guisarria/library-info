import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const extractDependencyNames = (text: string) => {
  const extractedDependency = text
    .replace(/"dependencies":\s*{\s*/, "")
    .replace(/"devDependencies":\s*{\s*/, "")
    .replace(/\s*}\s*$/, "")

  return [...extractedDependency.matchAll(/"([^"]+)":/g)].map(
    (match) => match[1]
  )
}
