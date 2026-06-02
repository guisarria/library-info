const OPENLINK_PREVIEW_ENDPOINT = "https://www.openlink.sh/api/preview"
const CACHE_CONTROL = "public, max-age=3600"
const SCHEME_REGEX = /^[a-z][a-z0-9+.-]*:/i

function normalizeLinkPreviewTarget(value: string | null): string | null {
  const trimmedValue = value?.trim() ?? ""

  if (
    trimmedValue.length === 0 ||
    trimmedValue.startsWith("/") ||
    trimmedValue.startsWith("#")
  ) {
    return null
  }

  if (SCHEME_REGEX.test(trimmedValue) && !/^https?:/i.test(trimmedValue)) {
    return null
  }

  try {
    const url = new URL(
      SCHEME_REGEX.test(trimmedValue) ? trimmedValue : `https://${trimmedValue}`
    )

    if (
      (url.protocol !== "http:" && url.protocol !== "https:") ||
      url.username ||
      url.password
    ) {
      return null
    }

    return url.href
  } catch {
    return null
  }
}

async function handleLinkPreviewRequest(request: Request) {
  if (request.method === "OPTIONS") {
    return new Response(null, {
      headers: { Allow: "GET, HEAD, OPTIONS" },
      status: 204
    })
  }

  const requestUrl = new URL(request.url)
  const previewUrl = normalizeLinkPreviewTarget(
    requestUrl.searchParams.get("url")
  )

  if (!previewUrl) {
    return Response.json(
      { error: "Invalid preview URL" },
      {
        status: 400
      }
    )
  }

  if (request.method === "HEAD") {
    return new Response(null, {
      headers: {
        "Cache-Control": CACHE_CONTROL
      },
      status: 204
    })
  }

  const upstreamUrl = `${OPENLINK_PREVIEW_ENDPOINT}?url=${encodeURIComponent(
    previewUrl
  )}`

  try {
    const response = await fetch(upstreamUrl, {
      headers: {
        Accept: "application/json"
      }
    })

    if (!response.ok) {
      return Response.json(
        { error: "Failed to fetch link preview" },
        {
          status: 502
        }
      )
    }

    return Response.json(await response.json(), {
      headers: {
        "Cache-Control": CACHE_CONTROL
      }
    })
  } catch {
    return Response.json(
      { error: "Failed to fetch link preview" },
      {
        status: 502
      }
    )
  }
}

export function HEAD(request: Request) {
  return handleLinkPreviewRequest(request)
}

export function OPTIONS(request: Request) {
  return handleLinkPreviewRequest(request)
}

export function GET(request: Request) {
  return handleLinkPreviewRequest(request)
}
