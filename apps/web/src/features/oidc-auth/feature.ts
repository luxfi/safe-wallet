/**
 * OIDC Auth Feature Implementation - v3 Lazy-Loaded
 *
 * This entire file is lazy-loaded via the feature handle.
 * Use direct imports - do NOT use lazy() inside.
 */
import type { OidcAuthContract } from './contract'
import IdSignInButton from './components/IdSignInButton'

const feature: OidcAuthContract = {
  IdSignInButton,
}

export default feature satisfies OidcAuthContract
