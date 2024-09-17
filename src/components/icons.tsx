import { ClipboardList } from "lucide-react"

import { cn } from "@/lib/utils"

const PlaceholderIcon = ({
  isVisible,
  className,
}: {
  isVisible: boolean
  className?: string
}) => {
  if (!isVisible) return null
  return (
    <div className={cn(className)}>
      <p className="">Paste dependencies here</p>
      <ClipboardList size={200} strokeWidth={1} />
    </div>
  )
}

const EnterIcon = ({
  isVisible,
  className,
}: {
  isVisible: boolean
  className?: string
}) => {
  if (!isVisible) return null
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 16 16"
      className={cn("text-inherit", className)}
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      >
        <rect width="13" height="13" x=".5" y=".5" rx="1" />
        <path d="m5.5 10.5l-2-2l2-2" />
        <path d="M3.5 8.5h5a1 1 0 0 0 1-1v-3" />
      </g>
    </svg>
  )
}

export { PlaceholderIcon, EnterIcon }
