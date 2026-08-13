import type { ReactElement, ReactNode } from 'react'
import { Typography } from '@/components/ui/typography'
import { Github } from 'lucide-react'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import css from './styles.module.css'
import { AppRoutes } from '@/config/routes'
import { APP_VERSION, APP_HOMEPAGE } from '@/config/version'
import ExternalLink from '../ExternalLink'
import { Link } from '@/components/ui/link'
import { useIsOfficialHost } from '@/hooks/useIsOfficialHost'
import { HELP_CENTER_URL } from '@safe-global/utils/config/constants'
import { IS_PRODUCTION, COMMIT_HASH, BRAND_NAME } from '@/config/constants'
import { brand } from '@safe-global/brand'
import type { FooterProps } from './footer.type'

const footerPages = [
  AppRoutes.settings.index,
  AppRoutes.imprint,
  AppRoutes.privacy,
  AppRoutes.cookie,
  AppRoutes.terms,
  AppRoutes.licenses,
  AppRoutes.welcome.accounts,
  AppRoutes.welcome.spaces,
]

const FooterLink = ({ children, href }: { children: ReactNode; href: string }): ReactElement => {
  return href ? (
    <Link variant="inherit" render={<NextLink href={href} />}>
      {children}
    </Link>
  ) : (
    <Link variant="inherit">{children}</Link>
  )
}

const Footer: React.FC<FooterProps> = ({
  forceShow,
  preferences = true,
  versionIcon = true,
  helpCenter = true,
  className = css.container,
}): ReactElement | null => {
  const router = useRouter()
  const isOfficialHost = useIsOfficialHost()
  const initialYear = 2025
  const currentYear = new Date().getFullYear()
  const copyrightYear = initialYear === currentYear ? initialYear : `${initialYear}–${currentYear}`

  if (!footerPages.some((path) => router.pathname.startsWith(path)) && !forceShow) {
    return null
  }

  const getHref = (path: string): string => {
    return router.pathname === path ? '' : path
  }

  return (
    <footer className={className}>
      <ul>
        {isOfficialHost ? (
          <>
            <li>
              <Typography variant="paragraph-mini">&copy;{copyrightYear} Safe Labs GmbH</Typography>
            </li>
            <li>
              <FooterLink href={getHref(AppRoutes.terms)}>Terms</FooterLink>
            </li>
            <li>
              <FooterLink href={getHref(AppRoutes.privacy)}>Privacy</FooterLink>
            </li>
            <li>
              <FooterLink href={getHref(AppRoutes.licenses)}>Licenses</FooterLink>
            </li>
            <li>
              <FooterLink href={getHref(AppRoutes.imprint)}>Imprint</FooterLink>
            </li>
            <li>
              <FooterLink href={getHref(AppRoutes.cookie)}>Cookie policy</FooterLink>
            </li>
            {preferences && (
              <li>
                <FooterLink href={getHref(AppRoutes.settings.index)}>Preferences</FooterLink>
              </li>
            )}
            {helpCenter && (
              <li>
                <ExternalLink href={HELP_CENTER_URL} noIcon className="[&_span]:underline">
                  Help
                </ExternalLink>
              </li>
            )}
          </>
        ) : (
          // A white-label is not an unofficial distribution of someone else's
          // app — it is its own product, and it has its own legal pages. Name
          // the brand and link them.
          <>
            <li>
              <Typography variant="paragraph-mini">
                &copy;{copyrightYear} {BRAND_NAME}
              </Typography>
            </li>
            <li>
              <ExternalLink href={brand.termsUrl} noIcon className="[&_span]:underline">
                Terms
              </ExternalLink>
            </li>
            <li>
              <ExternalLink href={brand.privacyUrl} noIcon className="[&_span]:underline">
                Privacy
              </ExternalLink>
            </li>
            {preferences && (
              <li>
                <FooterLink href={getHref(AppRoutes.settings.index)}>Preferences</FooterLink>
              </li>
            )}
          </>
        )}

        <li>
          <ExternalLink href={`${APP_HOMEPAGE}/releases/tag/web-v${APP_VERSION}`} noIcon>
            {versionIcon && <Github className="mr-1 inline size-3" />}v{APP_VERSION}
          </ExternalLink>
        </li>

        {!IS_PRODUCTION && COMMIT_HASH && (
          <li>
            <ExternalLink href={`${APP_HOMEPAGE}/commit/${COMMIT_HASH}`} noIcon>
              {COMMIT_HASH.slice(0, 7)}
            </ExternalLink>
          </li>
        )}
      </ul>
    </footer>
  )
}

export default Footer
