import { useCallback } from 'react'
import { GATEWAY_URL } from '@/config/gateway'
import { AppRoutes } from '@/config/routes'
import { iam } from '@/features/oidc-auth'
import { LOGGING_OUT_KEY } from '@/hooks/useLogoutCallback'
import useOnboard from '@/hooks/wallets/useOnboard'
import useWallet from '@/hooks/wallets/useWallet'

const LOGOUT_REDIRECT_PATH = '/v1/auth/logout/redirect'

/**
 * Hook for logging out: the wallet connection, the IAM session, and the CGW session.
 *
 * The IAM session goes first, while the page is still ours: its tokens are revoked at the
 * issuer and cleared locally. Then the /v1/auth/logout/redirect endpoint returns a 303 the
 * browser must follow at top level to clear the CGW cookie, so it is reached by a hidden
 * form POST rather than fetch.
 *
 * Sets a transient flag in sessionStorage so that after the redirect lands back in the app,
 * `useLogoutCallback` can reconcile with the backend via /v1/auth/me.
 *
 * Disconnects the connected wallet first: the logout triggers a full page navigation, so without
 * this the wallet would be auto-reconnected on the next load via the `lastWallet` storage key.
 */
const useLogout = () => {
  const onboard = useOnboard()
  const wallet = useWallet()

  const logout = useCallback(async () => {
    if (onboard && wallet) {
      await onboard.disconnectWallet({ label: wallet.label })
    }

    // Signing out ends every session this browser holds. IAM's tokens are
    // revoked at the issuer and cleared locally; without this they would
    // outlive the sign-out and silently sign the next visitor back in.
    await iam().logout()

    sessionStorage.setItem(LOGGING_OUT_KEY, '1')

    const redirectUrl = new URL(AppRoutes.welcome.spaces, window.location.origin).toString()
    const url = new URL(LOGOUT_REDIRECT_PATH, GATEWAY_URL)

    const form = document.createElement('form')
    form.method = 'POST'
    form.action = url.toString()
    form.style.display = 'none'

    const input = document.createElement('input')
    input.type = 'hidden'
    input.name = 'redirect_url'
    input.value = redirectUrl
    form.appendChild(input)

    document.body.appendChild(form)
    form.submit()
    document.body.removeChild(form)
  }, [onboard, wallet])

  return { logout }
}

export default useLogout
