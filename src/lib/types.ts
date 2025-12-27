export type Links = {
  npm: string
  homepage: string
  repository: string
  bugs: string
}

export type PackageMetadata = {
  name: string
  description?: string
  links: Links
  readme: string
}

export type PackageGithub = {
  homepage: string
  starsCount: number
  forksCount: number
  subscribersCount: number
}

export type PackageCollected = {
  metadata?: PackageMetadata
  github?: PackageGithub
}

export type Package = {
  collected?: PackageCollected
  name?: string
}

export type SearchParamsProps = {
  searchParams: Promise<{
    q?: string
  }>
}
