/**
 * @safe-global/brand — white-label brand tokens
 *
 * One source of truth for the human-facing brand. Every wallet shipped from
 * this monorepo reads these values; no `'Safe'` / `'safe.global'` literal
 * lives in `apps/` or `packages/*` source.
 *
 * Defaults match upstream Safe values, so an unbranded build is byte-for-byte
 * the same as today. Per-brand builds override via `NEXT_PUBLIC_BRAND_*`
 * (web) or `EXPO_PUBLIC_BRAND_*` (mobile) env vars at build time.
 */

export interface Brand {
  /** Product name as it appears in chrome, titles, marketing copy. */
  name: string
  /** Short form for tight UI (sidebar, badges). */
  shortName: string
  /** Apex domain — `safe.global`, `safe.lux.network`, `vault.hanzo.ai`. */
  domain: string
  /** App host — `app.safe.global`, `safe.lux.network`. */
  appHost: string
  /** Full app URL with scheme. */
  appUrl: string
  /** Support email. */
  email: string
  /** Help center / docs URL (no trailing slash). */
  helpUrl: string
  /** Terms of service URL. */
  termsUrl: string
  /** Privacy policy URL. */
  privacyUrl: string
  /** Imprint / legal URL. */
  imprintUrl: string
  /** Cookie policy URL. */
  cookieUrl: string
  /** Licenses page URL. */
  licensesUrl: string
  /** Brand logo path (served by the app, swap per brand). */
  logoUrl: string
  /** Favicon path. */
  faviconUrl: string
  /** Primary brand color (hex). */
  primaryColor: string
  /** Status page URL. */
  statusUrl: string
  /** Developer portal URL. */
  developerUrl: string
  /** Gateway service URL (CGW — Safe Transaction Service). */
  gatewayUrl: string
  /** Staging gateway URL. */
  gatewayStagingUrl: string
  /** Discord / chat invite URL. */
  discordUrl: string
  /** Twitter / X URL. */
  twitterUrl: string
  /** Support chat alias domain (Pylon). */
  supportChatAliasDomain: string
  /** GitHub repo URL. */
  githubUrl: string
  /** Apple App Store URL (mobile). */
  appStoreUrl: string
  /** Google Play Store URL (mobile). */
  playStoreUrl: string
  /** Help article slug prefix (legacy `articles/` path). */
  helpArticlesPath: string
}

const env = (key: string, fallback: string): string => {
  // Read NEXT_PUBLIC_* (web) and EXPO_PUBLIC_* (mobile) interchangeably so the
  // same brand bundle works in both apps.
  const next = `NEXT_PUBLIC_BRAND_${key}`
  const expo = `EXPO_PUBLIC_BRAND_${key}`
  return process.env[next] ?? process.env[expo] ?? fallback
}

export const brand: Brand = {
  name: env('NAME', 'Safe{Wallet}'),
  shortName: env('SHORT_NAME', 'Safe'),
  domain: env('DOMAIN', 'safe.global'),
  appHost: env('APP_HOST', 'app.safe.global'),
  appUrl: env('APP_URL', 'https://app.safe.global'),
  email: env('EMAIL', 'support@safe.global'),
  helpUrl: env('HELP_URL', 'https://help.safe.global'),
  termsUrl: env('TERMS_URL', 'https://safe.global/terms'),
  privacyUrl: env('PRIVACY_URL', 'https://safe.global/privacy'),
  imprintUrl: env('IMPRINT_URL', 'https://safe.global/imprint'),
  cookieUrl: env('COOKIE_URL', 'https://safe.global/cookie'),
  licensesUrl: env('LICENSES_URL', 'https://safe.global/licenses'),
  logoUrl: env('LOGO_URL', '/images/safe-logo-green.png'),
  faviconUrl: env('FAVICON_URL', '/favicon.ico'),
  primaryColor: env('PRIMARY_COLOR', '#12FF80'),
  statusUrl: env('STATUS_URL', 'https://status.safe.global'),
  developerUrl: env('DEVELOPER_URL', 'https://developer.safe.global'),
  gatewayUrl: env('GATEWAY_URL', 'https://safe-client.safe.global'),
  gatewayStagingUrl: env('GATEWAY_STAGING_URL', 'https://safe-client.staging.5afe.dev'),
  discordUrl: env('DISCORD_URL', 'https://chat.safe.global'),
  twitterUrl: env('TWITTER_URL', 'https://twitter.com/safe'),
  supportChatAliasDomain: env('SUPPORT_CHAT_ALIAS_DOMAIN', 'anon.safe.global'),
  githubUrl: env('GITHUB_URL', 'https://github.com/safe-global/safe-wallet-monorepo'),
  appStoreUrl: env('APP_STORE_URL', 'https://apps.apple.com/app/id1515759131'),
  playStoreUrl: env('PLAY_STORE_URL', 'https://play.google.com/store/apps/details?id=io.gnosis.safe'),
  helpArticlesPath: env('HELP_ARTICLES_PATH', 'articles'),
}

export default brand
