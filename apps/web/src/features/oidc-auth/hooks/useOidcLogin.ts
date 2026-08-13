import { useCallback } from 'react'
import { startLogin } from '@hanzo/iam/browser'
import { iam } from '../iam'
import { OIDC_AUTH_PENDING_KEY } from '../constants'

/**
 * Starts the OIDC Authorization Code + PKCE flow at Hanzo IAM.
 *
 * IAM owns the credential interaction: its login page offers whatever the
 * application is configured for — password, one-time code, passkey, wallet,
 * social — so this app renders one entry point and never a button per method.
 *
 * The current URL is stashed as the post-login destination; IAM returns to
 * `/auth/callback`, which completes the exchange and lands the user back here.
 */
export const useOidcLogin = () => {
  const login = useCallback(async () => {
    iam()
    sessionStorage.setItem(OIDC_AUTH_PENDING_KEY, '1')
    await startLogin({ redirect: window.location.href })
  }, [])

  return { login }
}
