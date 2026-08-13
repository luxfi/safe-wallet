import type { ReactNode } from 'react'
import Head from 'next/head'
import { Typography } from '@/components/ui/typography'
import ExternalLink from '@/components/common/ExternalLink'
import { useIsOfficialHost } from '@/hooks/useIsOfficialHost'
import { BRAND_NAME } from '@/config/constants'

/**
 * A legal page. The bundled text belongs to the official host; a white-label
 * publishes its own on its own domain, so point the reader there rather than
 * show them an empty page.
 */
const Legal = ({ title, href, children }: { title: string; href: string; children: ReactNode }) => {
  const isOfficialHost = useIsOfficialHost()

  return (
    <>
      <Head>
        <title>{`${BRAND_NAME} – ${title}`}</title>
      </Head>

      <main style={{ lineHeight: '1.5' }}>
        {isOfficialHost ? (
          children
        ) : (
          <>
            <Typography variant="h1" className="mb-4">
              {title}
            </Typography>
            <Typography>
              {BRAND_NAME} publishes its {title.toLowerCase()} at <ExternalLink href={href}>{href}</ExternalLink>.
            </Typography>
          </>
        )}
      </main>
    </>
  )
}

export default Legal
