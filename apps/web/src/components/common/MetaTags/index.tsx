import { BRAND_NAME, IS_PRODUCTION, IS_BEHIND_IAP, IS_OFFICIAL_HOST } from '@/config/constants'
import { ContentSecurityPolicy, StrictTransportSecurity } from '@/config/securityHeaders'
import { lightPalette, darkPalette } from '@safe-global/theme/palettes'
import { brand } from '@safe-global/brand'

const descriptionText = `${BRAND_NAME} is the most trusted smart account wallet on Ethereum with over $100B secured.`
const titleText = BRAND_NAME
const socialShareImage = `${brand.appUrl}/images/social-share.png`
// A brand keeps its icon set beside its favicon.
const brandIcons = brand.faviconUrl.replace(/\/[^/]*$/, '')

const MetaTags = ({ prefetchUrl }: { prefetchUrl: string }) => (
  <>
    <meta name="description" content={descriptionText} />
    {!IS_PRODUCTION && <meta name="robots" content="noindex" />}

    {/* Social sharing */}
    <meta name="og:image" content={socialShareImage} />
    <meta name="og:description" content={descriptionText} />
    <meta name="og:title" content={titleText} />
    <meta name="twitter:card" content="summary_large_image" />
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
    <link rel="manifest" href="/safe.webmanifest" {...(IS_BEHIND_IAP && { crossOrigin: 'use-credentials' })} />

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
        <link rel="shortcut icon" href={brand.faviconUrl} />
        <link rel="apple-touch-icon" sizes="192x192" href={`${brandIcons}/android-chrome-192x192.png`} />
        <link rel="icon" type="image/png" sizes="512x512" href={`${brandIcons}/android-chrome-512x512.png`} />
        <link rel="icon" type="image/png" sizes="192x192" href={`${brandIcons}/android-chrome-192x192.png`} />
      </>
    )}
  </>
)

export default MetaTags
