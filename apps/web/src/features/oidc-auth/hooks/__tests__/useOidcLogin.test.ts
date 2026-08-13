import { renderHook, act } from '@testing-library/react'
import { startLogin } from '@hanzo/iam/browser'
import { useOidcLogin } from '../useOidcLogin'
import { OIDC_AUTH_PENDING_KEY } from '../../constants'

jest.mock('@hanzo/iam/browser', () => ({
  configureIam: jest.fn(() => ({})),
  startLogin: jest.fn(() => Promise.resolve()),
}))

describe('useOidcLogin', () => {
  const originalLocation = window.location

  beforeEach(() => {
    jest.clearAllMocks()
    sessionStorage.clear()

    Object.defineProperty(window, 'location', {
      writable: true,
      value: { ...originalLocation, href: 'https://safe.lux.network/welcome/spaces' },
    })
  })

  afterEach(() => {
    Object.defineProperty(window, 'location', {
      writable: true,
      value: originalLocation,
    })
  })

  it('flags the sign-in as pending so the expiry guard holds its probe', async () => {
    const { result } = renderHook(() => useOidcLogin())

    await act(async () => {
      await result.current.login()
    })

    expect(sessionStorage.getItem(OIDC_AUTH_PENDING_KEY)).toBe('1')
  })

  it('starts the PKCE flow and returns to the page the user signed in from', async () => {
    const { result } = renderHook(() => useOidcLogin())

    await act(async () => {
      await result.current.login()
    })

    expect(startLogin).toHaveBeenCalledWith({ redirect: 'https://safe.lux.network/welcome/spaces' })
  })
})
