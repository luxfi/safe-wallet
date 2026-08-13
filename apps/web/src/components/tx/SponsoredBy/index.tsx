import chains from '@safe-global/utils/config/chains'
import { markUrl } from '@/components/common/Logo'
import { BRAND_NAME } from '@/config/constants'
import css from './styles.module.css'

export const RELAY_SPONSORS = {
  [chains.gno]: {
    name: 'Gnosis',
    logo: '/images/common/gnosis-chain-logo.png',
  },
  default: {
    name: BRAND_NAME,
    logo: markUrl,
  },
}

const SponsoredBy = ({ chainId }: { chainId: string }) => {
  const sponsor = RELAY_SPONSORS[chainId] || RELAY_SPONSORS.default

  return (
    <>
      <img src={sponsor.logo} alt={sponsor.name} className={css.logo} /> {sponsor.name}
    </>
  )
}

export default SponsoredBy
