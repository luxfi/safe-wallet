import { render, screen } from '@testing-library/react'
import SafeLogo from '../index'
import { AppRoutes } from '@/config/routes'
import { BRAND_LOGO, BRAND_NAME } from '@/config/constants'

jest.mock('next/link', () => {
  const MockLink = ({ href, children, ...props }: { href: string; children: React.ReactNode }) => (
    <a href={href} {...props}>
      {children}
    </a>
  )
  MockLink.displayName = 'Link'
  return { __esModule: true, default: MockLink }
})

describe('SafeLogo', () => {
  it('renders a link to /welcome/spaces by default', () => {
    render(<SafeLogo />)
    expect(screen.getByRole('link')).toHaveAttribute('href', AppRoutes.welcome.spaces)
  })

  it('renders a link to the provided href', () => {
    render(<SafeLogo href="/welcome" />)
    expect(screen.getByRole('link')).toHaveAttribute('href', '/welcome')
  })

  it("renders the brand's own logo with alt text and testid", () => {
    render(<SafeLogo />)
    const img = screen.getByTestId('logo-image')
    expect(img).toHaveAttribute('alt', BRAND_NAME)
    expect(img).toHaveAttribute('src', BRAND_LOGO)
  })

  it('renders the Home label pill variant with the logo', () => {
    render(<SafeLogo href={AppRoutes.welcome.accounts} showHomeLabel />)
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', AppRoutes.welcome.accounts)
    expect(link).toHaveTextContent('Home')
    expect(screen.getByTestId('logo-image')).toBeInTheDocument()
  })
})
