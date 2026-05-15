import { brand, type Brand } from './index'

describe('brand', () => {
  it('exposes the upstream Safe defaults when no env vars are set', () => {
    expect(brand.name).toBe('Safe{Wallet}')
    expect(brand.shortName).toBe('Safe')
    expect(brand.domain).toBe('safe.global')
    expect(brand.email).toBe('support@safe.global')
    expect(brand.helpUrl).toBe('https://help.safe.global')
  })

  it('matches the Brand interface', () => {
    const b: Brand = brand
    expect(typeof b.name).toBe('string')
    expect(typeof b.shortName).toBe('string')
    expect(typeof b.domain).toBe('string')
    expect(typeof b.email).toBe('string')
    expect(typeof b.logoUrl).toBe('string')
  })

  it('exposes every documented URL', () => {
    const required: Array<keyof Brand> = [
      'helpUrl',
      'termsUrl',
      'privacyUrl',
      'imprintUrl',
      'cookieUrl',
      'licensesUrl',
      'statusUrl',
      'developerUrl',
      'gatewayUrl',
      'discordUrl',
      'twitterUrl',
    ]
    for (const key of required) {
      expect(brand[key]).toMatch(/^https?:\/\//)
    }
  })
})
