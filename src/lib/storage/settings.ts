import type { StoredSettings } from '@/types/settings'

const STORAGE_KEY = 'hermes_settings'

export async function getSettings(): Promise<StoredSettings | null> {
  const result = await chrome.storage.sync.get(STORAGE_KEY)
  const raw = result[STORAGE_KEY] as StoredSettings | undefined
  if (!raw?.personalAccessToken || !raw.baseId || !raw.tableName) return null
  return raw
}

export async function saveSettings(settings: StoredSettings): Promise<void> {
  await chrome.storage.sync.set({ [STORAGE_KEY]: settings })
}
