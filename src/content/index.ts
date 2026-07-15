import type { ExtensionMessage, ExtensionResponse } from '@/types/messages'
import { scrapeProfile } from '@/lib/scraper'

chrome.runtime.onMessage.addListener(
  (message: ExtensionMessage, _sender, sendResponse: (response: ExtensionResponse) => void) => {
    if (message.type === 'SCRAPE_PROFILE') {
      try {
        const data = scrapeProfile()
        sendResponse({ ok: true, data })
      } catch (e) {
        sendResponse({
          ok: false,
          error: e instanceof Error ? e.message : 'Scrape failed',
        })
      }
      return true
    }
    return false
  },
)
