import { useEffect, useState } from 'react'
import { getSettings, saveSettings } from '@/lib/storage/settings'
import type { StoredSettings } from '@/types/settings'

export function SettingsForm() {
  const [form, setForm] = useState<StoredSettings>({
    personalAccessToken: '',
    baseId: '',
    tableName: '',
  })
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    void getSettings().then((s) => {
      if (s) setForm(s)
    })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSaved(false)
    try {
      await saveSettings(form)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch {
      setError('Failed to save settings. Please try again.')
    }
  }

  return (
    <form onSubmit={(e) => void handleSubmit(e)} className="space-y-5 max-w-md">
      <div>
        <h1 className="text-lg font-semibold text-gray-900">hermes-connect Settings</h1>
        <p className="text-sm text-gray-500 mt-1">
          Configure your Airtable connection to capture LinkedIn profiles.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Personal Access Token
        </label>
        <input
          type="password"
          value={form.personalAccessToken}
          onChange={(e) => setForm((f) => ({ ...f, personalAccessToken: e.target.value }))}
          className="mt-1 w-full border border-gray-300 rounded px-3 py-2 text-sm
                     focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="patXXXXXXXXX..."
          required
          autoComplete="off"
        />
        <p className="mt-1 text-xs text-gray-400">
          Create one at airtable.com/create/tokens with data.records:write scope.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Base ID</label>
        <input
          type="text"
          value={form.baseId}
          onChange={(e) => setForm((f) => ({ ...f, baseId: e.target.value }))}
          className="mt-1 w-full border border-gray-300 rounded px-3 py-2 text-sm
                     focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="appXXXXXXXXX..."
          required
        />
        <p className="mt-1 text-xs text-gray-400">
          Found in your Airtable base URL: airtable.com/appXXX/...
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Table Name</label>
        <input
          type="text"
          value={form.tableName}
          onChange={(e) => setForm((f) => ({ ...f, tableName: e.target.value }))}
          className="mt-1 w-full border border-gray-300 rounded px-3 py-2 text-sm
                     focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Contacts"
          required
        />
        <p className="mt-1 text-xs text-gray-400">
          Must match exactly as shown in Airtable. The table must have a{' '}
          <code className="bg-gray-100 px-1 rounded">profileUrl</code> column.
        </p>
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}
      {saved && <p className="text-green-600 text-sm">Settings saved.</p>}

      <button
        type="submit"
        className="bg-blue-600 text-white px-5 py-2 rounded text-sm font-medium
                   hover:bg-blue-700 transition-colors"
      >
        Save Settings
      </button>
    </form>
  )
}
