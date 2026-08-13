import type { ComponentProps } from 'react'
import { BRAND_NAME, IS_OFFICIAL_HOST } from '@/config/constants'
import { brand } from '@safe-global/brand'

/** Horizontal lockup — the product name in full. */
export const logoUrl = IS_OFFICIAL_HOST ? '/images/logo-safe-labs.svg' : brand.logoUrl

/** Square app mark — for the places a wordmark does not fit. */
export const markUrl = IS_OFFICIAL_HOST ? '/images/logo-no-text.svg' : brand.markUrl

type Props = Omit<ComponentProps<'img'>, 'src'>

export const Logo = ({ alt = BRAND_NAME, ...props }: Props) => <img src={logoUrl} alt={alt} {...props} />

export const Mark = ({ alt = BRAND_NAME, ...props }: Props) => <img src={markUrl} alt={alt} {...props} />
