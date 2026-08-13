import { useState, useEffect, useRef, useCallback } from 'react'
import { brand } from '@safe-global/brand'
import { Errors, logError } from '@/services/exceptions'

const SHOW_ALERT_TIMEOUT = 10000

const isSafari = (): boolean => {
  return navigator.userAgent.indexOf('Safari') > -1 && navigator.userAgent.indexOf('Chrome') <= -1
}

const createIframe = (uri: string, onload: () => void): HTMLIFrameElement => {
  const iframeElement: HTMLIFrameElement = document.createElement('iframe')

  iframeElement.src = uri
  iframeElement.setAttribute('style', 'display:none')
  iframeElement.onload = onload

  return iframeElement
}

type ThirdPartyCookiesType = {
  thirdPartyCookiesDisabled: boolean
  setThirdPartyCookiesDisabled: (value: boolean) => void
}

const useThirdPartyCookies = (): ThirdPartyCookiesType => {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [thirdPartyCookiesDisabled, setThirdPartyCookiesDisabled] = useState<boolean>(false)
  const checkUrl = brand.cookieCheckUrl
  const checkOrigin = checkUrl ? new URL(checkUrl).origin : ''

  const messageHandler = useCallback(
    (event: MessageEvent) => {
      if (event.origin !== checkOrigin) return

      const data = event.data

      try {
        if (data.hasOwnProperty('isCookieEnabled')) {
          setThirdPartyCookiesDisabled(!data.isCookieEnabled)
          window.removeEventListener('message', messageHandler)
          document.body.removeChild(iframeRef.current as Node)
        }
      } catch (error) {
        logError(Errors._905, error)
      }
    },
    [checkOrigin],
  )

  useEffect(() => {
    // Safari answers the question by blocking the probe, and a brand without a
    // probe of its own would be asking a stranger's frame on our users' behalf.
    if (isSafari() || !checkUrl) {
      return
    }

    window.addEventListener('message', messageHandler)

    const iframeElement: HTMLIFrameElement = createIframe(checkUrl, () =>
      iframeElement?.contentWindow?.postMessage({ test: 'cookie' }, checkOrigin),
    )

    iframeRef.current = iframeElement
    document.body.appendChild(iframeElement)
  }, [messageHandler, checkUrl, checkOrigin])

  useEffect(() => {
    let id: ReturnType<typeof setTimeout>

    if (thirdPartyCookiesDisabled) {
      id = setTimeout(() => setThirdPartyCookiesDisabled(false), SHOW_ALERT_TIMEOUT)
    }

    return () => clearTimeout(id)
  }, [thirdPartyCookiesDisabled])

  return { thirdPartyCookiesDisabled, setThirdPartyCookiesDisabled }
}

export default useThirdPartyCookies
