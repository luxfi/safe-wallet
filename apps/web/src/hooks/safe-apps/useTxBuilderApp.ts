import { useRouter } from 'next/router'
import type { UrlObject } from 'url'
import { brand } from '@safe-global/brand'

import { AppRoutes } from '@/config/routes'

/**
 * The transaction builder, if the brand publishes one. It opens inside the Safe
 * Apps frame, so an address here is a page our users load under our name —
 * a brand that has not stood one up offers nothing rather than someone else's.
 */
export const useTxBuilderApp = (): { link: UrlObject } | undefined => {
  const router = useRouter()

  if (!brand.txBuilderUrl) return

  return {
    link: {
      pathname: AppRoutes.apps.open,
      query: { safe: router.query.safe, appUrl: brand.txBuilderUrl },
    },
  }
}
