import { render, screen } from '@/tests/test-utils'
import SignInOptions from '../index'

const mockAfterSignIn = jest.fn()

jest.mock('@/services/analytics', () => ({
  trackEvent: jest.fn(),
  EventType: { META: 'meta' },
}))

jest.mock('@/services/siwe/useSiwe', () => ({
  useSiwe: () => ({ signIn: jest.fn(), loading: false }),
}))

jest.mock('@/features/spaces', () => ({
  useCurrentSpaceId: () => null,
}))

const MockIdSignInButton = () => <button data-testid="id-login-btn">Continue with Lux ID</button>

const mockUseLoadFeature = jest.fn()

jest.mock('@/features/__core__', () => ({
  useLoadFeature: () => mockUseLoadFeature(),
  createFeatureHandle: () => ({}),
}))

const mockOidcAuthFeature = (isDisabled: boolean, isReady = !isDisabled) =>
  mockUseLoadFeature.mockReturnValue({
    IdSignInButton: isDisabled ? () => null : MockIdSignInButton,
    $isDisabled: isDisabled,
    $isReady: isReady,
  })

describe('SignInOptions', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render wallet, divider and ID buttons when OIDC auth is enabled', () => {
    mockOidcAuthFeature(false)

    render(<SignInOptions afterSignIn={mockAfterSignIn} />)

    expect(screen.getByTestId('connect-wallet-btn')).toBeInTheDocument()
    expect(screen.getByText('OR')).toBeInTheDocument()
    expect(screen.getByTestId('id-login-btn')).toBeInTheDocument()
  })

  it('should render the wallet button first, above the divider and the ID option', () => {
    mockOidcAuthFeature(false)

    render(<SignInOptions afterSignIn={mockAfterSignIn} />)

    const wallet = screen.getByTestId('connect-wallet-btn')
    const divider = screen.getByText('OR')
    const id = screen.getByTestId('id-login-btn')

    expect(wallet.compareDocumentPosition(divider) & Node.DOCUMENT_POSITION_FOLLOWING).not.toBe(0)
    expect(divider.compareDocumentPosition(id) & Node.DOCUMENT_POSITION_FOLLOWING).not.toBe(0)
  })

  it('should render only wallet button when OIDC auth is disabled', () => {
    mockOidcAuthFeature(true)

    render(<SignInOptions afterSignIn={mockAfterSignIn} />)

    expect(screen.queryByTestId('id-login-btn')).not.toBeInTheDocument()
    expect(screen.queryByText('OR')).not.toBeInTheDocument()
    expect(screen.getByTestId('connect-wallet-btn')).toBeInTheDocument()
  })

  it('should render only wallet button while feature is loading', () => {
    mockOidcAuthFeature(false, false)

    render(<SignInOptions afterSignIn={mockAfterSignIn} />)

    expect(screen.queryByTestId('id-login-btn')).not.toBeInTheDocument()
    expect(screen.queryByText('OR')).not.toBeInTheDocument()
    expect(screen.getByTestId('connect-wallet-btn')).toBeInTheDocument()
  })

  it('should show "Continue with wallet" text on the wallet button', () => {
    mockOidcAuthFeature(false)

    render(<SignInOptions afterSignIn={mockAfterSignIn} />)

    expect(screen.getByText('Continue with wallet')).toBeInTheDocument()
  })
})
