"use client"

import { GlobeIcon, LinkIcon } from "lucide-react"
import { type ComponentProps, type ReactNode, useEffect, useState } from "react"

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

export type LinkPreviewMetadata = {
  description: string | null
  favicon: string | null
  image: string | null
  siteName: string | null
  title: string | null
  url: string
}

export type LinkPreviewEndpointPayload = unknown

type LinkPreviewCardStatus = "idle" | "loading" | "success" | "error"

type LinkPreviewCardState = {
  metadata: LinkPreviewMetadata | null
  previewUrl: string | null
  status: LinkPreviewCardStatus
}

type LinkPreviewProps = Omit<
  ComponentProps<"a">,
  "children" | "href" | "rel" | "target"
> & {
  children: ReactNode
  endpoint?: string
  href: string
  previewDisabled?: boolean
  rel?: string
  target?: string
}

type LinkPreviewCardProps = {
  className?: string
  enabled?: boolean
  endpoint?: string
  href: string
}

type LinkPreviewFloatingCardProps = {
  anchor: Element | null
  className?: string
  endpoint?: string
  href: string
  onOpenChange?: (open: boolean) => void
  onPointerEnter?: ComponentProps<"div">["onPointerEnter"]
  onPointerLeave?: ComponentProps<"div">["onPointerLeave"]
  open: boolean
}

const DEFAULT_ENDPOINT = "/api/link-preview"
const DEFAULT_LINK_CLASS_NAME =
  "cursor-pointer text-primary underline underline-offset-4 decoration-primary/40 transition-colors hover:text-primary/80 hover:decoration-primary"

const SCHEME_REGEX = /^[a-z][a-z0-9+.-]*:/i
const EMAIL_LIKE_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const metadataCache = new Map<string, LinkPreviewMetadata>()
const inFlightMetadata = new Map<string, Promise<LinkPreviewMetadata>>()

function getString(value: unknown): string | null {
  return typeof value === "string" && value.trim().length > 0 ? value : null
}

function getRecord(value: unknown): Record<string, unknown> | null {
  return typeof value === "object" && value !== null
    ? (value as Record<string, unknown>)
    : null
}

function getNestedString(value: unknown, key: string): string | null {
  return getString(getRecord(value)?.[key])
}

function getMetadataData(
  payload: LinkPreviewEndpointPayload,
): Record<string, unknown> {
  const root = getRecord(payload)
  return getRecord(root?.data) ?? root ?? {}
}

export function getLinkPreviewUrl(href: string): string | null {
  const trimmedHref = href.trim()

  if (
    trimmedHref.length === 0 ||
    trimmedHref.startsWith("/") ||
    trimmedHref.startsWith("#") ||
    EMAIL_LIKE_REGEX.test(trimmedHref) ||
    trimmedHref.toLowerCase().startsWith("mailto:")
  ) {
    return null
  }

  if (SCHEME_REGEX.test(trimmedHref) && !/^https?:/i.test(trimmedHref)) {
    return null
  }

  const withProtocol = SCHEME_REGEX.test(trimmedHref)
    ? trimmedHref
    : `https://${trimmedHref}`

  try {
    const parsedUrl = new URL(withProtocol)

    if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
      return null
    }

    return parsedUrl.href
  } catch {
    return null
  }
}

export function parseLinkPreviewMetadata(
  payload: LinkPreviewEndpointPayload,
  href: string,
): LinkPreviewMetadata {
  const data = getMetadataData(payload)
  const url = new URL(href)
  const imageValue = data.image
  const logoValue = data.logo

  return {
    description: getString(data.description),
    favicon:
      getString(logoValue) ??
      getNestedString(logoValue, "url") ??
      getString(data.favicon) ??
      `${url.origin}/favicon.ico`,
    image:
      getString(imageValue) ??
      getNestedString(imageValue, "url") ??
      getString(data.website_image),
    siteName:
      getString(data.publisher) ??
      getString(data.website_name) ??
      getString(data.siteName) ??
      url.hostname,
    title: getString(data.title),
    url: href,
  }
}

export async function fetchLinkPreviewMetadata(
  href: string,
  endpoint = DEFAULT_ENDPOINT,
): Promise<LinkPreviewMetadata> {
  const previewUrl = getLinkPreviewUrl(href)

  if (!previewUrl) {
    throw new Error("Unsupported preview URL")
  }

  const cacheKey = `${endpoint}:${previewUrl}`
  const cached = metadataCache.get(cacheKey)

  if (cached) {
    return cached
  }

  const existingRequest = inFlightMetadata.get(cacheKey)

  if (existingRequest) {
    return existingRequest
  }

  const request = (async () => {
    const separator = endpoint.includes("?") ? "&" : "?"
    const response = await fetch(
      `${endpoint}${separator}url=${encodeURIComponent(previewUrl)}`,
    )

    if (!response.ok) {
      throw new Error(`Failed to fetch link preview (${response.status})`)
    }

    const metadata = parseLinkPreviewMetadata(await response.json(), previewUrl)
    metadataCache.set(cacheKey, metadata)
    return metadata
  })()

  inFlightMetadata.set(cacheKey, request)

  try {
    return await request
  } finally {
    inFlightMetadata.delete(cacheKey)
  }
}

export function formatLinkPreviewDisplayUrl(href: string): string {
  const previewUrl = getLinkPreviewUrl(href) ?? href

  try {
    const parsedUrl = new URL(previewUrl)
    const path = parsedUrl.pathname === "/" ? "" : parsedUrl.pathname
    return `${parsedUrl.hostname}${path}`.replace(/\/$/, "")
  } catch {
    return href.replace(/^https?:\/\//i, "").replace(/\/$/, "")
  }
}

export function LinkPreviewCard({
  href,
  endpoint,
  enabled = true,
  className,
}: LinkPreviewCardProps) {
  const [state, setState] = useState<LinkPreviewCardState>({
    metadata: null,
    previewUrl: null,
    status: "idle",
  })
  const [showImage, setShowImage] = useState(true)
  const [showFavicon, setShowFavicon] = useState(true)
  const previewUrl = getLinkPreviewUrl(href)

  useEffect(() => {
    setShowImage(true)
    setShowFavicon(true)
  }, [state.metadata?.favicon, state.metadata?.image])

  useEffect(() => {
    if (!enabled || !previewUrl) {
      return
    }

    let cancelled = false
    setState({
      metadata: null,
      previewUrl,
      status: "loading",
    })

    fetchLinkPreviewMetadata(previewUrl, endpoint)
      .then((nextMetadata) => {
        if (cancelled) {
          return
        }

        setState({
          metadata: nextMetadata,
          previewUrl,
          status: "success",
        })
      })
      .catch(() => {
        if (cancelled) {
          return
        }

        setState({
          metadata: null,
          previewUrl,
          status: "error",
        })
      })

    return () => {
      cancelled = true
    }
  }, [enabled, endpoint, previewUrl])

  if (!previewUrl) {
    return <LinkPreviewFallback className={className} href={href} />
  }

  const isCurrentPreview = state.previewUrl === previewUrl

  if (
    !isCurrentPreview ||
    state.status === "loading" ||
    state.status === "idle"
  ) {
    return <LinkPreviewSkeleton className={className} />
  }

  if (state.status === "error" || !state.metadata) {
    return <LinkPreviewFallback className={className} href={previewUrl} />
  }

  const { metadata } = state

  return (
    <div className={cn("flex min-w-0 flex-col gap-3", className)}>
      {metadata.image && showImage ? (
        <div className="overflow-hidden rounded-md border bg-muted">
          <img
            alt={metadata.title ?? "Website preview"}
            className="aspect-video w-full object-cover"
            decoding="async"
            loading="lazy"
            onError={() => setShowImage(false)}
            src={metadata.image}
          />
        </div>
      ) : null}

      <div className="flex min-w-0 items-center gap-2">
        {metadata.favicon && showFavicon ? (
          <img
            alt=""
            className="size-5 shrink-0 rounded-sm"
            decoding="async"
            loading="lazy"
            onError={() => setShowFavicon(false)}
            src={metadata.favicon}
          />
        ) : (
          <GlobeIcon aria-hidden="true" className="size-5 shrink-0" />
        )}
        <span className="truncate text-xs font-medium text-muted-foreground">
          {metadata.siteName ?? formatLinkPreviewDisplayUrl(previewUrl)}
        </span>
      </div>

      {metadata.title ? (
        <div className="line-clamp-2 wrap-break-word text-sm font-medium">
          {metadata.title}
        </div>
      ) : null}

      {metadata.description ? (
        <div className="line-clamp-3 wrap-break-word text-xs text-muted-foreground">
          {metadata.description}
        </div>
      ) : null}

      <div className="truncate text-xs text-primary">
        {formatLinkPreviewDisplayUrl(previewUrl)}
      </div>
    </div>
  )
}

export function LinkPreviewFloatingCard({
  anchor,
  className,
  endpoint,
  href,
  onOpenChange,
  onPointerEnter,
  onPointerLeave,
  open,
}: LinkPreviewFloatingCardProps) {
  const previewUrl = getLinkPreviewUrl(href)

  if (!anchor || !previewUrl) {
    return null
  }

  return (
    <HoverCard
      open={open}
      onOpenChange={(nextOpen) => onOpenChange?.(nextOpen)}
    >
      <HoverCardContent
        align="start"
        anchor={anchor}
        className={cn(
          "w-80 max-w-[calc(100vw-1rem)] rounded-md p-3 text-popover-foreground",
          className,
        )}
        onPointerEnter={onPointerEnter}
        onPointerLeave={onPointerLeave}
        sideOffset={8}
      >
        <LinkPreviewCard enabled={open} endpoint={endpoint} href={previewUrl} />
      </HoverCardContent>
    </HoverCard>
  )
}

export function LinkPreview({
  children,
  className,
  endpoint,
  href,
  previewDisabled = false,
  rel = "noopener noreferrer",
  target = "_blank",
  ...anchorProps
}: LinkPreviewProps) {
  const [open, setOpen] = useState(false)
  const previewUrl = getLinkPreviewUrl(href)
  const anchorHref = previewUrl ?? href.trim()
  const anchorClassName = cn(DEFAULT_LINK_CLASS_NAME, className)

  if (!anchorHref) {
    return null
  }

  if (previewDisabled || !previewUrl) {
    return (
      <a
        className={anchorClassName}
        href={anchorHref}
        rel={rel}
        target={target}
        {...anchorProps}
      >
        {children}
      </a>
    )
  }

  return (
    <HoverCard open={open} onOpenChange={(nextOpen) => setOpen(nextOpen)}>
      <HoverCardTrigger
        className={anchorClassName}
        href={anchorHref}
        rel={rel}
        target={target}
        {...anchorProps}
      >
        <LinkIcon className="text-cyan-600 dark:text-cyan-400" size={14} />
        {children}
      </HoverCardTrigger>
      <HoverCardContent
        align="start"
        className="w-80 max-w-[calc(100vw-1rem)] rounded-md p-3"
        sideOffset={8}
      >
        <LinkPreviewCard enabled={open} endpoint={endpoint} href={previewUrl} />
      </HoverCardContent>
    </HoverCard>
  )
}

function LinkPreviewSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("flex min-w-0 flex-col gap-3", className)}>
      <Skeleton className="aspect-video w-full rounded-md" />
      <div className="flex items-center gap-2">
        <Skeleton className="size-5 rounded-sm" />
        <Skeleton className="h-3 w-32 rounded" />
      </div>
      <Skeleton className="h-4 w-11/12 rounded" />
      <div className="flex flex-col gap-1">
        <Skeleton className="h-3 w-full rounded" />
        <Skeleton className="h-3 w-4/5 rounded" />
      </div>
      <Skeleton className="h-3 w-40 rounded" />
    </div>
  )
}

function LinkPreviewFallback({
  className,
  href,
}: {
  className?: string
  href: string
}) {
  const displayUrl = formatLinkPreviewDisplayUrl(href)

  if (!displayUrl) {
    return null
  }

  return (
    <div className={cn("flex min-w-0 flex-col gap-2 text-sm", className)}>
      <div className="flex min-w-0 items-center gap-2">
        <GlobeIcon
          aria-hidden="true"
          className="size-4 shrink-0 "
        />
        <span className="truncate text-xs font-medium text-muted-foreground">
          {displayUrl}
        </span>
      </div>
      <div className="truncate text-xs text-primary">{displayUrl}</div>
    </div>
  )
}
