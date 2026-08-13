import { brand } from '@safe-global/brand'
import { IS_OFFICIAL_HOST } from '@/config/constants'

const rawAppVersion = process.env.NEXT_PUBLIC_APP_VERSION
const rawAppHomepage = process.env.NEXT_PUBLIC_APP_HOMEPAGE
if (!rawAppVersion) {
  throw new Error('Environment variable NEXT_PUBLIC_APP_VERSION is required but was not set or is empty.')
}
if (!rawAppHomepage) {
  throw new Error('Environment variable NEXT_PUBLIC_APP_HOMEPAGE is required but was not set or is empty.')
}
export const APP_VERSION = rawAppVersion
// Releases and commits are read from the repository this build comes from.
export const APP_HOMEPAGE = IS_OFFICIAL_HOST ? rawAppHomepage : brand.githubUrl
