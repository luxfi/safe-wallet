/**
 * @safe-global/brand — domain-driven white-label brand tokens.
 *
 * The brand is resolved from the REQUEST HOST at runtime (like getWhiteLabelBrand
 * across the rest of the Hanzo/Lux shared stack), NOT baked at build time. One
 * image serves every brand: `safe.lux.network` → Lux, `safe.zoo.network` → Zoo,
 * `safe.pars.network` → Pars, `vault.hanzo.ai` → Hanzo. No single brand is
 * hardcoded — when no host matches, the fallback is Lux monochrome.
 *
 * Every `'Safe'` / `'safe.global'` literal in the app reads from this `brand`
 * object, so swapping the host swaps the whole product identity.
 */

export interface Brand {
  name: string
  shortName: string
  /** One factual sentence. Feeds meta tags, the PWA manifest and wallet metadata. */
  description: string
  domain: string
  appHost: string
  appUrl: string
  email: string
  helpUrl: string
  termsUrl: string
  privacyUrl: string
  imprintUrl: string
  cookieUrl: string
  licensesUrl: string
  /** Wordmark — the horizontal lockup used in the header and on the login page. */
  logoUrl: string
  /** Square mark — the app icon used wherever the wordmark does not fit. */
  markUrl: string
  faviconUrl: string
  primaryColor: string
  statusUrl: string
  developerUrl: string
  gatewayUrl: string
  gatewayStagingUrl: string
  discordUrl: string
  twitterUrl: string
  supportChatAliasDomain: string
  githubUrl: string
  appStoreUrl: string
  playStoreUrl: string
  helpArticlesPath: string
}

// The Lux Safe Client Gateway is multi-chain (Lux 96369 / Zoo 200200 /
// Pars 494949), so every Lux-family brand shares it until each stands up its own.
const CGW = 'https://safe-cgw.lux.network'

// Lux — the monochrome default. Neutral chrome, black primary.
const lux: Brand = {
  name: 'Lux Safe',
  shortName: 'Lux Safe',
  description: 'Lux Safe is the multi-signature smart account wallet for the Lux Network.',
  domain: 'safe.lux.network',
  appHost: 'safe.lux.network',
  appUrl: 'https://safe.lux.network',
  email: 'support@lux.network',
  helpUrl: 'https://docs.lux.network/safe',
  termsUrl: 'https://lux.network/terms',
  privacyUrl: 'https://lux.network/privacy',
  imprintUrl: 'https://lux.network/imprint',
  cookieUrl: 'https://lux.network/cookie',
  licensesUrl: 'https://lux.network/licenses',
  logoUrl: '/brand/lux/logo.svg',
  markUrl: '/brand/lux/mark.svg',
  faviconUrl: '/brand/lux/favicon.ico',
  primaryColor: '#000000',
  statusUrl: 'https://status.lux.network',
  developerUrl: 'https://docs.lux.network',
  gatewayUrl: CGW,
  gatewayStagingUrl: CGW,
  discordUrl: 'https://discord.gg/lux',
  twitterUrl: 'https://x.com/luxfi',
  supportChatAliasDomain: 'anon.lux.network',
  githubUrl: 'https://github.com/luxfi/safe-wallet',
  appStoreUrl: '',
  playStoreUrl: '',
  helpArticlesPath: 'articles',
}

const zoo: Brand = {
  ...lux,
  name: 'Zoo Safe',
  shortName: 'Zoo Safe',
  description: 'Zoo Safe is the multi-signature smart account wallet for the Zoo Network.',
  domain: 'safe.zoo.network',
  appHost: 'safe.zoo.network',
  appUrl: 'https://safe.zoo.network',
  email: 'support@zoo.network',
  helpUrl: 'https://docs.zoo.network/safe',
  termsUrl: 'https://zoo.network/terms',
  privacyUrl: 'https://zoo.network/privacy',
  imprintUrl: 'https://zoo.network/imprint',
  cookieUrl: 'https://zoo.network/cookie',
  licensesUrl: 'https://zoo.network/licenses',
  logoUrl: '/brand/zoo/logo.svg',
  markUrl: '/brand/zoo/mark.svg',
  faviconUrl: '/brand/zoo/favicon.ico',
  primaryColor: '#FCF006',
  statusUrl: 'https://status.zoo.network',
  developerUrl: 'https://docs.zoo.network',
  discordUrl: 'https://discord.gg/edmZPTZjH9',
  twitterUrl: 'https://x.com/zoo_labs',
  supportChatAliasDomain: 'anon.zoo.network',
  githubUrl: 'https://github.com/zooai/safe-wallet',
}

const pars: Brand = {
  ...lux,
  name: 'Pars Safe',
  shortName: 'Pars Safe',
  description: 'Pars Safe is the multi-signature smart account wallet for the Pars Network.',
  domain: 'safe.pars.network',
  appHost: 'safe.pars.network',
  appUrl: 'https://safe.pars.network',
  email: 'support@pars.network',
  helpUrl: 'https://docs.pars.network/safe',
  termsUrl: 'https://pars.network/terms',
  privacyUrl: 'https://pars.network/privacy',
  imprintUrl: 'https://pars.network/imprint',
  cookieUrl: 'https://pars.network/cookie',
  licensesUrl: 'https://pars.network/licenses',
  logoUrl: '/brand/pars/logo.svg',
  markUrl: '/brand/pars/mark.svg',
  faviconUrl: '/brand/pars/favicon.ico',
  primaryColor: '#6366F1',
  statusUrl: 'https://status.pars.network',
  developerUrl: 'https://docs.pars.network',
  discordUrl: 'https://discord.gg/pars',
  twitterUrl: 'https://x.com/parsdao',
  supportChatAliasDomain: 'anon.pars.network',
  githubUrl: 'https://github.com/parsdao/safe-wallet',
}

const hanzo: Brand = {
  ...lux,
  name: 'Hanzo Vault',
  shortName: 'Vault',
  description: 'Hanzo Vault is the multi-signature smart account wallet for the Hanzo network.',
  domain: 'vault.hanzo.ai',
  appHost: 'vault.hanzo.ai',
  appUrl: 'https://vault.hanzo.ai',
  email: 'support@hanzo.ai',
  helpUrl: 'https://docs.hanzo.ai/vault',
  termsUrl: 'https://hanzo.ai/terms',
  privacyUrl: 'https://hanzo.ai/privacy',
  imprintUrl: 'https://hanzo.ai/imprint',
  cookieUrl: 'https://hanzo.ai/cookie',
  licensesUrl: 'https://hanzo.ai/licenses',
  logoUrl: '/brand/hanzo/logo.svg',
  markUrl: '/brand/hanzo/mark.svg',
  faviconUrl: '/brand/hanzo/favicon.ico',
  primaryColor: '#FFFFFF',
  statusUrl: 'https://status.hanzo.ai',
  developerUrl: 'https://docs.hanzo.ai',
  discordUrl: 'https://discord.gg/CJCyAsm9Vr',
  twitterUrl: 'https://x.com/hanzoai',
  supportChatAliasDomain: 'anon.hanzo.ai',
  githubUrl: 'https://github.com/hanzoai/safe-wallet',
}

/** Host suffix → brand. First match wins; Lux monochrome is the fallback. */
const REGISTRY: ReadonlyArray<readonly [RegExp, Brand]> = [
  [/(^|\.)lux\.network$/i, lux],
  [/(^|\.)zoo\.network$/i, zoo],
  [/(^|\.)pars\.network$/i, pars],
  [/(^|\.)hanzo\.ai$/i, hanzo],
]

/** Resolve the brand for a hostname (defaults to the current host on the web). */
export const resolveBrand = (hostname?: string): Brand => {
  const host = (
    hostname ??
    (typeof globalThis !== 'undefined'
      ? (globalThis as { location?: { hostname?: string } }).location?.hostname
      : '') ??
    ''
  ).toLowerCase()
  for (const [re, b] of REGISTRY) if (re.test(host)) return b
  return lux // Lux monochrome default — never a non-Lux brand.
}

/**
 * Live brand: every property access resolves against the current host, so the
 * same bundle themes per-domain. During SSG/build (no `location`) it resolves
 * to the Lux default, which is exactly the wanted fallback.
 */
export const brand: Brand = new Proxy({} as Brand, {
  get: (_target, prop) => (resolveBrand() as unknown as Record<string | symbol, unknown>)[prop],
  has: (_target, prop) => prop in lux,
  ownKeys: () => Reflect.ownKeys(lux),
  getOwnPropertyDescriptor: () => ({ enumerable: true, configurable: true }),
})

export default brand
