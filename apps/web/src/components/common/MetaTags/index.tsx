import { BRAND_NAME, IS_PRODUCTION, IS_BEHIND_IAP, IS_OFFICIAL_HOST } from '@/config/constants'
import { ContentSecurityPolicy, StrictTransportSecurity } from '@/config/securityHeaders'
import { lightPalette, darkPalette } from '@safe-global/theme/palettes'
import { brand } from '@safe-global/brand'

const descriptionText = IS_OFFICIAL_HOST
  ? 'Safe is the most trusted smart account wallet on Ethereum with over $100B secured.'
  : brand.description
const titleText = BRAND_NAME
// A brand keeps its icon set, its manifest and its social card beside its favicon.
const brandIcons = brand.faviconUrl.replace(/\/[^/]*$/, '')
const socialShareImage = IS_OFFICIAL_HOST
  ? `${brand.appUrl}/images/social-share.png`
  : `${brand.appUrl}${brandIcons}/android-chrome-512x512.png`

const MetaTags = ({ prefetchUrl }: { prefetchUrl: string }) => (
  <>
    <meta name="description" content={descriptionText} />
    {!IS_PRODUCTION && <meta name="robots" content="noindex" />}

    {/* Social sharing */}
    <meta name="og:image" content={socialShareImage} />
    <meta name="og:description" content={descriptionText} />
    <meta name="og:title" content={titleText} />
    <meta name="twitter:card" content={IS_OFFICIAL_HOST ? 'summary_large_image' : 'summary'} />
    <meta name="twitter:site" content={brand.twitterUrl} />
    <meta name="twitter:title" content={titleText} />
    <meta name="twitter:description" content={descriptionText} />
    <meta name="twitter:image" content={socialShareImage} />

    {/* CSP */}
    <meta httpEquiv="Content-Security-Policy" content={ContentSecurityPolicy} />
    {IS_PRODUCTION && <meta httpEquiv="Strict-Transport-Security" content={StrictTransportSecurity} />}

    {/* Prefetch the backend domain */}
    <link rel="dns-prefetch" href={prefetchUrl} />
    <link rel="preconnect" href={prefetchUrl} crossOrigin="" />

    {/* Mobile tags */}
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />

    {/* PWA primary color and manifest */}
    <meta name="theme-color" content={lightPalette.background.main} media="(prefers-color-scheme: light)" />
    <meta name="theme-color" content={darkPalette.background.main} media="(prefers-color-scheme: dark)" />
    {/* The installed app carries the brand's own name and icons. */}
    <link
      rel="manifest"
      href={IS_OFFICIAL_HOST ? '/safe.webmanifest' : `${brandIcons}/manifest.json`}
      {...(IS_BEHIND_IAP && { crossOrigin: 'use-credentials' })}
    />

    {/* Favicons — the brand's own, resolved from the request host like the rest
        of its identity. Every brand declares faviconUrl and ships an icon set
        beside it; without this the tab wore Safe's mark on every white-label. */}
    {IS_OFFICIAL_HOST ? (
      <>
        <link rel="shortcut icon" href="/favicons/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/favicons/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicons/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicons/favicon-16x16.png" />
        <link rel="mask-icon" href="/favicons/safari-pinned-tab.svg" color="#000" />
      </>
    ) : (
      <>
        {/* The mark itself, transparent, carrying a prefers-color-scheme rule —
            so the tab shows dark ink on a light chrome and light ink on a dark
            one, instead of a tile that is the wrong colour on one of them.
            Browsers that read SVG icons prefer this; the .ico below is what the
            rest fall back to, and it cannot ask what colour the chrome is, so it
            commits to a white mark with a dark keyline.

            Both sizes are load-bearing, and this pairing was arrived at by
            reading the tab strip rather than the spec. Chrome ranks candidates
            by how near a declared size is to the one it wants, so it silently
            preferred the .ico while the SVG sat there unused: an unsized
            `shortcut icon` outranks an SVG that declares nothing, and it still
            outranks `sizes="any"`. Saying what the .ico actually is — 32x32 —
            lets "any" win it, and the .ico stays declared so a reader without
            SVG support still gets THIS brand's mark rather than falling through
            to the root /favicon.ico, which one static export shares with every
            other brand. */}
        <link rel="icon" type="image/svg+xml" sizes="any" href={brand.markUrl} />
        <link rel="icon" sizes="32x32" href={brand.faviconUrl} />
        <link rel="apple-touch-icon" sizes="192x192" href={`${brandIcons}/android-chrome-192x192.png`} />
      </>
    )}
  </>
)

export default MetaTags
