import { useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import { handleCallback } from '@hanzo/iam/browser'
import { useAppDispatch } from '@/store'
import { setAuthenticated, setIsOidcLoginPending, SESSION_LIFETIME_MS } from '@/store/authSlice'
import { showNotification } from '@/store/notificationsSlice'
import { AppRoutes } from '@/config/routes'
import { trackEvent } from '@/services/analytics'
import { SPACE_EVENTS } from '@/services/analytics/events/spaces'
import { AuthLoginMethod, MixpanelEventParams } from '@/services/analytics/mixpanel-events'
import { iam } from '../iam'
import { OIDC_AUTH_PENDING_KEY, SIGN_IN_ERROR_MESSAGE } from '../constants'

/** Only a same-origin destination is followed, so a stashed URL cannot send the user off-site. */
const localPath = (url: string): string => {
  try {
    const target = new URL(url, window.location.origin)
    return target.origin === window.location.origin ? target.pathname + target.search + target.hash : '/'
  } catch {
    return '/'
  }
}

/**
 * Completes the IAM sign-in on `/auth/callback`.
 *
 * The SDK verifies `state`, spends the PKCE verifier, exchanges the code at the
 * discovered token endpoint and stores the session. Its expiry becomes the
 * app's session expiry, so a wallet session and an IAM session are the same one
 * piece of state. Then the user lands back where they started.
 */
export const useOidcLoginCallback = () => {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const routerRef = useRef(router)
  const done = useRef(false)

  routerRef.current = router

  useEffect(() => {
    if (done.current) return
    done.current = true

    dispatch(setIsOidcLoginPending(true))

    const complete = async () => {
      try {
        iam()
        const { token, redirect } = await handleCallback()
        const lifetime = token.expiresIn ? token.expiresIn * 1000 : SESSION_LIFETIME_MS
        dispatch(setAuthenticated(Date.now() + lifetime))
        trackEvent(SPACE_EVENTS.AUTH_LOGIN_SUCCEEDED, {
          method: AuthLoginMethod.OIDC,
          timestamp: new Date().toISOString(),
        })
        await routerRef.current.replace(localPath(redirect))
      } catch (error) {
        dispatch(
          showNotification({ message: SIGN_IN_ERROR_MESSAGE, variant: 'error', groupKey: 'oidc-sign-in-failed' }),
        )
        trackEvent(SPACE_EVENTS.AUTH_LOGIN_FAILED, {
          [MixpanelEventParams.FAILURE_REASON]: error instanceof Error ? error.message : 'unknown',
          method: AuthLoginMethod.OIDC,
        })
        await routerRef.current.replace(AppRoutes.welcome.index)
      } finally {
        sessionStorage.removeItem(OIDC_AUTH_PENDING_KEY)
        dispatch(setIsOidcLoginPending(false))
      }
    }

    void complete()
  }, [dispatch])
}
