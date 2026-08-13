import { brand } from '@safe-global/brand'
import { Errors, logError } from '@/services/exceptions'

type SecurityCheckResponse = { status: 'affected' | 'safe' }

// Fails closed: a failed check is logged and treated as not affected. A brand
// with no check of its own asks nobody — the answer would be the same, and the
// question told a third party which Safe our user was looking at.
export const isSafeAffectedByZodiacVulnerability = async (chainId: string, safeAddress: string): Promise<boolean> => {
  if (!brand.zodiacUrl) return false

  try {
    const url = `${brand.zodiacUrl}?safes=${encodeURIComponent(`${chainId}:${safeAddress}`)}`
    const response = await fetch(url)
    if (!response.ok) throw new Error(`Zodiac security-check responded with ${response.status}`)

    const { status } = (await response.json()) as SecurityCheckResponse
    return status === 'affected'
  } catch (error) {
    logError(Errors._621, error)
    return false
  }
}
