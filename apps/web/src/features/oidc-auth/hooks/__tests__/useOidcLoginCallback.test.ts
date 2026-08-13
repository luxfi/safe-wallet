import { renderHook, waitFor } from '@testing-library/react'
import { handleCallback } from '@hanzo/iam/browser'
import { useOidcLoginCallback } from '../useOidcLoginCallback'
import { OIDC_AUTH_PENDING_KEY } from '../../constants'

const mockReplace = jest.fn()
const mockDispatch = jest.fn((action) => action)

jest.mock('@hanzo/iam/browser', () => ({
  configureIam: jest.fn(() => ({})),
  handleCallback: jest.fn(),
}))

jest.mock('@/store', () => ({
  useAppDispatch: () => mockDispatch,
}))

jest.mock('@/store/authSlice', () => ({
  SESSION_LIFETIME_MS: 24 * 60 * 60 * 1000,
  setAuthenticated: (expiresAt: number) => ({ type: 'auth/setAuthenticated', payload: expiresAt }),
  setIsOidcLoginPending: (pending: boolean) => ({ type: 'auth/setIsOidcLoginPending', payload: pending }),
}))

jest.mock('@/store/notificationsSlice', () => ({
  showNotification: (payload: Record<string, string>) => ({ type: 'notifications/showNotification', payload }),
}))

jest.mock('next/router', () => ({
  useRouter: () => ({ query: {}, pathname: '/auth/callback', replace: mockReplace }),
}))

const mockHandleCallback = handleCallback as jest.MockedFunction<typeof handleCallback>

describe('useOidcLoginCallback', () => {
  const originalLocation = window.location

  beforeEach(() => {
    jest.clearAllMocks()
    sessionStorage.clear()
    sessionStorage.setItem(OIDC_AUTH_PENDING_KEY, '1')

    mockHandleCallback.mockResolvedValue({
      token: { accessToken: 'at', expiresIn: 3600 },
      redirect: 'https://safe.lux.network/welcome/spaces?chain=lux',
    })

    Object.defineProperty(window, 'location', {
      writable: true,
      value: { ...originalLocation, origin: 'https://safe.lux.network', pathname: '/auth/callback' },
    })
  })

  afterEach(() => {
    jest.restoreAllMocks()
    Object.defineProperty(window, 'location', { writable: true, value: originalLocation })
  })

  it('exchanges the code and authenticates for the token lifetime', async () => {
    jest.spyOn(Date, 'now').mockReturnValue(1_000_000)

    renderHook(() => useOidcLoginCallback())

    await waitFor(() => {
      expect(mockHandleCallback).toHaveBeenCalled()
      expect(mockDispatch).toHaveBeenCalledWith({ type: 'auth/setAuthenticated', payload: 1_000_000 + 3_600_000 })
    })
  })

  it('lands the user back where they signed in from', async () => {
    renderHook(() => useOidcLoginCallback())

    await waitFor(() => expect(mockReplace).toHaveBeenCalledWith('/welcome/spaces?chain=lux'))
  })

  it('refuses an off-origin destination', async () => {
    mockHandleCallback.mockResolvedValue({ token: { accessToken: 'at' }, redirect: 'https://evil.example/steal' })

    renderHook(() => useOidcLoginCallback())

    await waitFor(() => expect(mockReplace).toHaveBeenCalledWith('/'))
  })

  it('falls back to the default lifetime when the token states none', async () => {
    jest.spyOn(Date, 'now').mockReturnValue(1_000_000)
    mockHandleCallback.mockResolvedValue({ token: { accessToken: 'at' }, redirect: '/home' })

    renderHook(() => useOidcLoginCallback())

    await waitFor(() =>
      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'auth/setAuthenticated',
        payload: 1_000_000 + 24 * 60 * 60 * 1000,
      }),
    )
  })

  it('notifies and returns to welcome when the exchange fails', async () => {
    mockHandleCallback.mockRejectedValue(new Error('state mismatch'))

    renderHook(() => useOidcLoginCallback())

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'notifications/showNotification',
        payload: expect.objectContaining({ variant: 'error', message: 'Something went wrong while signing in' }),
      })
      expect(mockReplace).toHaveBeenCalledWith('/welcome')
    })
    expect(mockDispatch).not.toHaveBeenCalledWith(expect.objectContaining({ type: 'auth/setAuthenticated' }))
  })

  it('clears the pending flag and the pending state, whichever way it ends', async () => {
    mockHandleCallback.mockRejectedValue(new Error('boom'))

    renderHook(() => useOidcLoginCallback())

    await waitFor(() => {
      expect(sessionStorage.getItem(OIDC_AUTH_PENDING_KEY)).toBeNull()
      expect(mockDispatch).toHaveBeenCalledWith({ type: 'auth/setIsOidcLoginPending', payload: false })
    })

    const calls = mockDispatch.mock.calls.map((c) => c[0])
    const opened = calls.findIndex((c) => c?.type === 'auth/setIsOidcLoginPending' && c?.payload === true)
    const closed = calls.findIndex((c) => c?.type === 'auth/setIsOidcLoginPending' && c?.payload === false)
    expect(opened).toBeLessThan(closed)
  })

  it('spends the code once, however often it re-renders', async () => {
    const { rerender } = renderHook(() => useOidcLoginCallback())
    rerender()

    await waitFor(() => expect(mockHandleCallback).toHaveBeenCalledTimes(1))
  })
})
