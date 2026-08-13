import { fireEvent, render, screen } from '@/tests/test-utils'
import { trackEvent } from '@/services/analytics'
import { SPACE_EVENTS } from '@/services/analytics/events/spaces'
import IdSignInButton from '../index'

const mockLogin = jest.fn()

jest.mock('@/services/analytics', () => ({
  trackEvent: jest.fn(),
  EventType: { META: 'meta' },
}))

jest.mock('../../../hooks/useOidcLogin', () => ({
  useOidcLogin: () => ({ login: mockLogin }),
}))

describe('IdSignInButton', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('names the brand identity it signs in with', () => {
    render(<IdSignInButton />)

    expect(screen.getByTestId('id-login-btn')).toBeInTheDocument()
    expect(screen.getByText('Continue with Lux ID')).toBeInTheDocument()
  })

  it('tracks the sign-in and starts the flow on click', () => {
    render(<IdSignInButton />)

    fireEvent.click(screen.getByTestId('id-login-btn'))

    expect(trackEvent).toHaveBeenCalledWith(SPACE_EVENTS.ID_SIGN_IN)
    expect(mockLogin).toHaveBeenCalled()
  })
})
