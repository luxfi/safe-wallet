import type { ReactElement } from 'react'
import Link from 'next/link'
import { AppRoutes } from '@/config/routes'
import { BRAND_NAME, IS_OFFICIAL_HOST } from '@/config/constants'
import { Logo, markUrl } from '@/components/common/Logo'
import { cn } from '@/utils/cn'
import css from './SafeLogo.module.css'

const MARK_SIZE = 'size-6 group-data-[collapsible=icon]:size-4.5 object-contain'

// This slot is square, so it takes the square mark rather than the wordmark.
// The Safe mark is drawn twice: an SVG for light mode and a filled span that
// picks up the primary colour in dark mode. A white-label ships one mark that
// reads on both, so it renders as a single image.
const LogoMark = (): ReactElement =>
  IS_OFFICIAL_HOST ? (
    <>
      <img
        src={markUrl}
        alt="Safe"
        width={24}
        height={24}
        className={`${MARK_SIZE} dark:hidden`}
        data-testid="logo-image"
      />
      <span className={`hidden dark:block ${MARK_SIZE} shrink-0 rounded-[2px] ${css.logoPrimaryFill}`} />
    </>
  ) : (
    <img
      src={markUrl}
      alt={BRAND_NAME}
      width={24}
      height={24}
      className={`${MARK_SIZE} shrink-0`}
      data-testid="logo-image"
    />
  )

const SafeLogo = ({
  href = AppRoutes.welcome.spaces,
  className,
  showHomeLabel = false,
  wordmark = false,
  'data-testid': testId,
}: {
  href?: string
  className?: string
  /** Renders a logo + "Home" label pill (Safe/space context) instead of the bare logo. */
  showHomeLabel?: boolean
  /** Set where the slot is wide: the horizontal lockup reads, the square mark is a smudge. */
  wordmark?: boolean
  'data-testid'?: string
}): ReactElement => {
  if (wordmark) {
    return (
      <Link href={href} data-testid={testId} className={cn('inline-flex items-center', className)}>
        <Logo className="h-7 w-auto max-w-full object-contain object-left" data-testid="logo-image" />
      </Link>
    )
  }

  if (showHomeLabel) {
    return (
      <Link
        href={href}
        data-testid={testId}
        className={cn(
          'flex items-center gap-2 rounded-lg bg-sidebar-accent px-3 py-2 text-sidebar-accent-foreground transition-opacity hover:opacity-80',
          className,
        )}
      >
        <LogoMark />
        <span className="text-sm font-semibold">Home</span>
      </Link>
    )
  }

  return (
    <Link
      href={href}
      data-testid={testId}
      className={cn('flex size-6 shrink-0 items-center justify-center', className)}
    >
      <LogoMark />
    </Link>
  )
}

export default SafeLogo
