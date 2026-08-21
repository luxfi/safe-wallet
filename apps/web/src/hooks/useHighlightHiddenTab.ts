import { useEffect } from 'react'
import { brand } from '@safe-global/brand'

// The blinking icon is the brand's own mark in alert red. It was Safe's green
// mark with a red dot on every white-label, which is the one place a competitor's
// logo reached a Lux tab — and it only showed while a tab waited on a signature,
// so nobody looking at the app ever saw it.
const ALT_FAVICON = brand.markUrl.replace(/mark\.svg$/, 'mark-alert.svg')
const TITLE_PREFIX = '‼️ '

const setFavicon = (favicon: HTMLLinkElement | null, href: string) => {
  if (favicon) favicon.href = href
}

const setDocumentTitle = (isPrefixed: boolean) => {
  document.title = isPrefixed ? TITLE_PREFIX + document.title : document.title.replace(TITLE_PREFIX, '')
}

const blinkFavicon = (
  favicon: HTMLLinkElement | null,
  originalHref: string,
  isBlinking = false,
): ReturnType<typeof setInterval> => {
  const onBlink = () => {
    setDocumentTitle(isBlinking)
    setFavicon(favicon, isBlinking ? ALT_FAVICON : originalHref)
    isBlinking = !isBlinking
  }

  onBlink()

  return setInterval(onBlink, 300)
}

/**
 * Blink favicon when the tab is hidden
 */
const useHighlightHiddenTab = () => {
  useEffect(() => {
    const favicon = document.querySelector<HTMLLinkElement>('link[rel*="icon"]')
    const originalHref = favicon?.href || ''
    let interval: ReturnType<typeof setInterval>

    const reset = () => {
      clearInterval(interval)
      setFavicon(favicon, originalHref)
      setDocumentTitle(false)
    }

    const handleVisibilityChange = () => {
      if (document.hidden) {
        interval = blinkFavicon(favicon, originalHref)
      } else {
        reset()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    handleVisibilityChange()

    return () => {
      reset()
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])
}

export default useHighlightHiddenTab
