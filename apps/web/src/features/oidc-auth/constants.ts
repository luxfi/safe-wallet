/**
 * Set before the redirect to IAM and cleared once the callback settles, so the
 * session-expiry guard knows a sign-in is mid-flight and holds its probe.
 */
export const OIDC_AUTH_PENDING_KEY = 'oidc_auth_pending'

export const SIGN_IN_ERROR_MESSAGE = 'Something went wrong while signing in'
