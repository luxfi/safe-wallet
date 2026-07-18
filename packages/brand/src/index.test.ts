import { brand, resolveBrand, type Brand } from './index'

describe('brand', () => {
  it('defaults to Lux monochrome when no host matches', () => {
    // No `location` in the test env → the Lux default.
    expect(brand.name).toBe('Lux Safe')
    expect(brand.domain).toBe('safe.lux.network')
    expect(brand.primaryColor).toBe('#121312')
    expect(resolveBrand('random.example.com').name).toBe('Lux Safe')
  })

  it('resolves the brand from the request host', () => {
    expect(resolveBrand('safe.lux.network').name).toBe('Lux Safe')
    expect(resolveBrand('app.lux.network').name).toBe('Lux Safe')
    expect(resolveBrand('safe.zoo.network').name).toBe('Zoo Safe')
    expect(resolveBrand('safe.pars.network').name).toBe('Pars Safe')
    expect(resolveBrand('vault.hanzo.ai').name).toBe('Hanzo Vault')
  })

  it('matches the Brand interface', () => {
    const b: Brand = brand
    expect(typeof b.name).toBe('string')
    expect(typeof b.shortName).toBe('string')
    expect(typeof b.domain).toBe('string')
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
