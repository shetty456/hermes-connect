import { useState, useCallback } from 'react'
import type { Contact } from '@/types/contact'
import { getSettings } from '@/lib/storage/settings'
import { AirtableRepository } from '@/lib/airtable/repository'
import { AirtableApiError } from '@/lib/airtable/client'

type CaptureState =
  | { status: 'idle' }
  | { status: 'saving' }
  | { status: 'saved' }
  | { status: 'error'; message: string }

export function useCapture(): {
  state: CaptureState
  capture: (contact: Contact) => Promise<void>
} {
  const [state, setState] = useState<CaptureState>({ status: 'idle' })

  const capture = useCallback(async (contact: Contact) => {
    setState({ status: 'saving' })

    try {
      const settings = await getSettings()
      if (!settings) {
        setState({
          status: 'error',
          message: 'Airtable not configured. Open extension options.',
        })
        return
      }

      const repo = new AirtableRepository(settings)
      const existing = await repo.findByProfileUrl(contact.profileUrl)

      if (existing) {
        await repo.update(contact)
      } else {
        await repo.create(contact)
      }

      setState({ status: 'saved' })
    } catch (e) {
      let message = 'Unknown error'
      if (e instanceof AirtableApiError) {
        message = `Airtable error (${e.statusCode}): ${e.message}`
      } else if (e instanceof Error) {
        message = e.message
      }
      setState({ status: 'error', message })
    }
  }, [])

  return { state, capture }
}
