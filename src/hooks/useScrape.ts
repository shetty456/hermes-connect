import { useState, useCallback } from 'react'
import type { Contact } from '@/types/contact'
import type { ExtensionMessage, ExtensionResponse } from '@/types/messages'

type ScrapeState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; contact: Contact }
  | { status: 'error'; message: string }

export function useScrape(tabId: number | null): {
  state: ScrapeState
  scrape: () => Promise<void>
} {
  const [state, setState] = useState<ScrapeState>({ status: 'idle' })

  const scrape = useCallback(async () => {
    if (tabId == null) return
    setState({ status: 'loading' })

    try {
      const message: ExtensionMessage = { type: 'SCRAPE_PROFILE' }
      const response: ExtensionResponse = await chrome.tabs.sendMessage(tabId, message)
      if (response.ok) {
        setState({ status: 'success', contact: response.data })
      } else {
        setState({ status: 'error', message: response.error })
      }
    } catch (e) {
      setState({
        status: 'error',
        message:
          e instanceof Error ? e.message : 'Content script not responding. Try refreshing the page.',
      })
    }
  }, [tabId])

  return { state, scrape }
}
