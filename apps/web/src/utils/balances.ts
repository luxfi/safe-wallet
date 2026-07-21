import { DUST_THRESHOLD } from '@/config/constants'
import { TokenType } from '@safe-global/store/gateway/types'

type DustFilterableItem = {
  fiatBalance: string
  fiatConversion: string
  tokenInfo: { type: string }
}

/**
 * Hide "dust" — tokens worth less than DUST_THRESHOLD in the selected fiat currency.
 *
 * A token can only be dust if we can actually price it. On chains with no fiat
 * price oracle the Client Gateway returns `fiatConversion: "0"` (e.g. the
 * Lux/Zoo/Pars C-Chains), which makes `fiatBalance` always "0" too. That means
 * the fiat value is UNKNOWN, not zero — filtering on it would wrongly hide the
 * entire balance, however large (the Lux Foundation treasury holds ~994.7B LUX).
 * So a token is kept when it is the native token, when its price is unknown, or
 * when its priced value clears the threshold. Only genuinely-priced dust is hidden.
 */
export const filterDustTokens = <T extends DustFilterableItem>(items: T[], hideDust: boolean): T[] => {
  if (!hideDust) return items
  return items.filter(
    (item) =>
      item.tokenInfo.type === TokenType.NATIVE_TOKEN ||
      !(Number(item.fiatConversion) > 0) ||
      Number(item.fiatBalance) >= DUST_THRESHOLD,
  )
}
