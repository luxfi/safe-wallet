/**
 * OIDC Auth Feature - Public API (v3 Architecture)
 *
 * Sign in with the brand's Hanzo IAM, alongside the wallet.
 *
 * @example
 * ```typescript
 * // Component access via feature handle
 * import { OidcAuthFeature } from '@/features/oidc-auth'
 * import { useLoadFeature } from '@/features/__core__'
 *
 * function MyComponent() {
 *   const { IdSignInButton } = useLoadFeature(OidcAuthFeature)
 *   return <IdSignInButton />
 * }
 *
 * // Hook access via direct import
 * import { useOidcLogin } from '@/features/oidc-auth'
 * ```
 */
import type { FeatureHandle } from '@/features/__core__'
import type { OidcAuthContract } from './contract'

// ─────────────────────────────────────────────────────────────────
// FEATURE HANDLE (lazy-loads components)
// ─────────────────────────────────────────────────────────────────

export const OidcAuthFeature: FeatureHandle<OidcAuthContract> = {
  name: 'oidc-auth',
  // Every brand resolves to an IAM, so identity sign-in is always offered.
  // It is a property of the domain, not of the chain being viewed, which is
  // why it does not hang off a chain feature flag.
  useIsEnabled: () => true,
  load: () => import('./feature'),
}

// Contract type
export type { OidcAuthContract } from './contract'

// ─────────────────────────────────────────────────────────────────
// PUBLIC HOOKS (always loaded, not lazy)
// ─────────────────────────────────────────────────────────────────

export { useOidcLogin } from './hooks/useOidcLogin'
export { useOidcLoginCallback } from './hooks/useOidcLoginCallback'
export { useAuthenticators } from './hooks/useAuthenticators'

// The configured OIDC client, for the sign-out path.
export { iam } from './iam'

// Direct (non-lazy) component exports: the spaces settings pages render these
// outside the lazy handle.
export { default as SwitchAuthenticatorSection } from './components/SwitchAuthenticatorSection'
export { default as WalletTwoFactorSection } from './components/WalletTwoFactorSection'
export { default as WorkspaceTwoFactorSection } from './components/WorkspaceTwoFactorSection'
export { default as MemberTwoFactorBadge } from './components/MemberTwoFactorBadge'

// ─────────────────────────────────────────────────────────────────
// 2FA STATUS DERIVATION (shared with the spaces Team page)
// ─────────────────────────────────────────────────────────────────

export { getMemberTwoFactorStatus, getTwoFactorCoverage, MemberTwoFactorStatus } from './utils/twoFactor'
