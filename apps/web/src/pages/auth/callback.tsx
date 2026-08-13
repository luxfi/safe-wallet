import type { NextPage } from 'next'
import Head from 'next/head'
import { brand } from '@safe-global/brand'
import { GradientCircularProgress } from '@/components/common/GradientCircularProgress'
import { Typography } from '@/components/ui/typography'
import { useOidcLoginCallback } from '@/features/oidc-auth'

/**
 * The OAuth redirect URI registered on the brand's Hanzo IAM application:
 * `${origin}/auth/callback`. IAM returns the authorization code here, the
 * callback hook spends it, and the user lands back where they signed in from.
 */
const AuthCallback: NextPage = () => {
  useOidcLoginCallback()

  return (
    <>
      <Head>
        <title>{`${brand.name} – Signing in`}</title>
      </Head>

      <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-6">
        <GradientCircularProgress size={40} thickness={5} />
        <Typography variant="paragraph-small" color="muted">
          Signing in with {brand.identity.name}…
        </Typography>
      </div>
    </>
  )
}

export default AuthCallback
