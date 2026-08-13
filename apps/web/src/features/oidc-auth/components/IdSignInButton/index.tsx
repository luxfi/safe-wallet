import { brand } from '@safe-global/brand'
import { Button } from '@/components/ui/button'
import { trackEvent } from '@/services/analytics'
import { SPACE_EVENTS } from '@/services/analytics/events/spaces'
import { useOidcLogin } from '../../hooks/useOidcLogin'

/**
 * Sign in with the brand's Hanzo IAM — one entry point, because IAM's login
 * page is what offers the methods the application enables.
 */
const IdSignInButton = () => {
  const { login } = useOidcLogin()

  const handleClick = () => {
    trackEvent(SPACE_EVENTS.ID_SIGN_IN)
    void login()
  }

  return (
    <Button variant="secondary" size="xl" onClick={handleClick} data-testid="id-login-btn" className="w-full">
      Continue with {brand.identity.name}
    </Button>
  )
}

export default IdSignInButton
