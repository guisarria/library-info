type Links = {
  npm?: string
  homepage?: string
  repository?: string
  bugs?: string
}

type PackageMetadata = {
  name: string
  description?: string
  links: Links
  readme: string
}

type PackageGithub = {
  homepage: string
  starsCount: number
  forksCount: number
  subscribersCount: number
}

type PackageCollected = {
  metadata?: PackageMetadata
  github?: PackageGithub
}

export type Package = {
  collected?: PackageCollected
  name?: string
}

export type SearchParamsProps = {
  searchParams: Promise<{
    packages?: string | string[]
  }>
}
