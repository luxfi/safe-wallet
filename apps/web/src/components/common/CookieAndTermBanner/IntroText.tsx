import type { ReactElement } from 'react'
import { Typography } from '@/components/ui/typography'
import ExternalLink from '../ExternalLink'
import { AppRoutes } from '@/config/routes'
import { useIsOfficialHost } from '@/hooks/useIsOfficialHost'
import { brand } from '@safe-global/brand'

const IntroText = ({ lastUpdated }: { lastUpdated: string }): ReactElement => {
  const isOfficialHost = useIsOfficialHost()

  return (
    <Typography variant="paragraph-small" className="block mb-2">
      By browsing this page, you accept our{' '}
      <ExternalLink href={isOfficialHost ? AppRoutes.terms : brand.termsUrl}>Terms & Conditions</ExternalLink> (last
      updated {lastUpdated}) and the use of necessary cookies. By clicking &quot;Accept all&quot; you additionally agree
      to the use of Beamer and Analytics cookies as listed below.{' '}
      <ExternalLink href={isOfficialHost ? AppRoutes.cookie : brand.cookieUrl}>Cookie policy</ExternalLink>
    </Typography>
  )
}

export default IntroText
