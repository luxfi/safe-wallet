import type { Chain } from '@safe-global/store/gateway/AUTO_GENERATED/chains'
import { getAllWallets, getSupportedWallets } from '../wallets'
import { WALLET_KEYS, CGW_NAMES } from '../consts'

const INJECTED = 'injected-module'

jest.mock('@web3-onboard/injected-wallets', () => ({ __esModule: true, default: () => INJECTED }))
jest.mock('@web3-onboard/coinbase', () => ({ __esModule: true, default: () => 'coinbase-module' }))
jest.mock('@web3-onboard/walletconnect', () => ({ __esModule: true, default: () => 'walletconnect-module' }))
jest.mock('@/services/private-key-module', () => ({ __esModule: true, default: () => 'pk-module' }))
jest.mock('@/services/onboard/ledger-module', () => ({ ledgerModule: () => 'ledger-module' }))
jest.mock('@/services/onboard/trezor/module', () => ({ trezorModule: () => 'trezor-module' }))

const chain = (disabledWallets: string[]) =>
  ({
    chainId: '96369',
    rpcUri: { authentication: 'NO_AUTHENTICATION', value: '' },
    disabledWallets,
  }) as unknown as Chain

describe('wallet modules', () => {
  it('registers injected wallets, so EIP-6963 wallets are discoverable', () => {
    expect(getAllWallets(chain([]))).toContain(INJECTED)
  })

  it('keeps injected wallets when the chain config disables none', () => {
    expect(getSupportedWallets(chain([]))).toContain(INJECTED)
  })

  it('drops injected wallets only when the chain config names them', () => {
    expect(getSupportedWallets(chain([CGW_NAMES[WALLET_KEYS.INJECTED]!]))).not.toContain(INJECTED)
  })
})
