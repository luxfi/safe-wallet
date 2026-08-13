import type { CoreTypes } from '@walletconnect/types'
import { brand } from '@safe-global/brand'

export const SAFE_WALLET_METADATA: CoreTypes.Metadata = {
  name: brand.name,
  description: `${brand.name} multi-signature wallet`,
  url: brand.appUrl,
  icons: [brand.faviconUrl.startsWith('http') ? brand.faviconUrl : `${brand.appUrl}${brand.faviconUrl}`],
  // Returns the user to the dApp after approving a deep-linked session; keep `native` in sync with app.config.ts scheme.
  redirect: {
    native: 'safe://',
    universal: brand.appUrl,
  },
}
