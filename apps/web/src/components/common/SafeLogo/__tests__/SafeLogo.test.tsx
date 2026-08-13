import { render, screen } from '@testing-library/react'
import SafeLogo from '../index'
import { AppRoutes } from '@/config/routes'
import { BRAND_NAME } from '@/config/constants'
import { logoUrl, markUrl } from '@/components/common/Logo'

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

  it("renders the brand's square mark with alt text and testid", () => {
    render(<SafeLogo />)
    const img = screen.getByTestId('logo-image')
    expect(img).toHaveAttribute('alt', BRAND_NAME)
    expect(img).toHaveAttribute('src', markUrl)
  })

  it('renders the horizontal lockup where the slot is wide', () => {
    render(<SafeLogo wordmark />)
    const img = screen.getByTestId('logo-image')
    expect(img).toHaveAttribute('src', logoUrl)
    // A lockup that inherits the square slot's box arrives as a smudge.
    expect(img.className).toContain('object-contain')
    expect(img.className).not.toContain('size-6')
  })

  it('renders the Home label pill variant with the logo', () => {
    render(<SafeLogo href={AppRoutes.welcome.accounts} showHomeLabel />)
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', AppRoutes.welcome.accounts)
    expect(link).toHaveTextContent('Home')
    expect(screen.getByTestId('logo-image')).toBeInTheDocument()
  })
})
