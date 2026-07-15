import type { Contact } from './contact'

export type ExtensionMessage = { type: 'SCRAPE_PROFILE' }

export type ExtensionResponse =
  | { ok: true; data: Contact }
  | { ok: false; error: string }
