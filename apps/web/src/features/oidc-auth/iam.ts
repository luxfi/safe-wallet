import { configureIam, type IAM } from '@hanzo/iam/browser'
import { brand } from '@safe-global/brand'

let client: IAM | null = null

/**
 * The OIDC client for the Hanzo IAM that serves this host.
 *
 * Issuer and client id come from the brand (`@safe-global/brand`), so one
 * bundle authenticates against `lux.id`, `zoolabs.id`, `pars.id` or
 * `iam.hanzo.ai` by domain. The client is public: PKCE S256, no secret in the
 * browser, `client_id` = `<org>-<app>`.
 *
 * `redirect_uri` is the SDK default `${origin}/auth/callback` — the page at
 * `src/pages/auth/callback.tsx`, and the exact URI the IAM application
 * registers. Token, userinfo, logout and revocation endpoints come from OIDC
 * discovery, so no endpoint path is written here.
 *
 * Resolved on first use rather than at module load: the brand reads
 * `location`, which does not exist during the static export.
 */
export const iam = (): IAM => {
  const { issuer, clientId } = brand.identity
  return (client ??= configureIam({ issuer, clientId }))
}
