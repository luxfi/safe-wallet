import type { NextPage } from 'next'
import Head from 'next/head'
import NextLink from 'next/link'
import { Typography } from '@/components/ui/typography'
import { Link } from '@/components/ui/link'
import { brand } from '@safe-global/brand'
import { BRAND_NAME } from '@/config/constants'

/**
 * Where to send a vulnerability report. Unlike the legal pages this text is
 * ours on every host, so it renders everywhere — only the address changes,
 * and it comes from the brand the host resolves to.
 */
const Security: NextPage = () => (
  <>
    <Head>
      <title>{`${BRAND_NAME} – Security`}</title>
    </Head>

    <main style={{ lineHeight: '1.5' }}>
      <Typography variant="h1" className="mb-4">
        Reporting a security problem
      </Typography>

      <Typography className="mb-4">
        Email <Link render={<NextLink href={`mailto:${brand.securityEmail}`} />}>{brand.securityEmail}</Link>. Tell us
        what you found and how to reproduce it. Send it to us before you tell anyone else, and do not open a public
        issue.
      </Typography>

      <Typography className="mb-8">
        A real report from a stranger is worth more than another internal review. We read every one.
      </Typography>

      <Typography variant="h2" className="mb-4">
        What happens next
      </Typography>

      <Typography className="mb-8">
        Someone will read your report and reply. If we can reproduce the problem we will tell you what we are doing
        about it, and tell you again once it is fixed. If we cannot reproduce it we will say so and ask you for what we
        are missing.
      </Typography>

      <Typography variant="h2" className="mb-4">
        While you are looking
      </Typography>

      <Typography className="mb-4">
        Test against accounts and funds that are your own. Do not read, change, or move anything that belongs to someone
        else. If you reach it by accident, stop, and say so in your report.
      </Typography>

      <Typography className="mb-8">
        Do not run anything that degrades the service for other people. No load testing, no denial of service, no mass
        automated scanning, and no social engineering of our staff or our users.
      </Typography>

      <Typography variant="h2" className="mb-4">
        For scanners
      </Typography>

      <Typography>
        This page is the policy named by{' '}
        <Link render={<NextLink href="/.well-known/security.txt" />}>/.well-known/security.txt</Link>, per RFC 9116.
      </Typography>
    </main>
  </>
)

export default Security
