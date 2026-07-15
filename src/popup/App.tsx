import { useEffect } from 'react'
import { useActiveTab } from '@/hooks/useActiveTab'
import { useScrape } from '@/hooks/useScrape'
import { useCapture } from '@/hooks/useCapture'
import { isLinkedInProfile } from '@/utils/linkedin'
import { ProfileCard } from './components/ProfileCard'
import { CaptureButton } from './components/CaptureButton'
import { StatusMessage } from './components/StatusMessage'

export function App() {
  const tab = useActiveTab()
  const isProfile = tab != null && isLinkedInProfile(tab.url)
  const { state: scrapeState, scrape } = useScrape(isProfile ? tab.id : null)
  const { state: captureState, capture } = useCapture()

  useEffect(() => {
    if (isProfile) {
      void scrape()
    }
  }, [isProfile, scrape])

  if (!isProfile) {
    return (
      <div className="p-4 w-72 text-center text-gray-500 text-sm">
        Open a LinkedIn profile first.
      </div>
    )
  }

  if (scrapeState.status === 'idle' || scrapeState.status === 'loading') {
    return (
      <div className="p-4 w-72 text-center text-gray-400 text-sm">Reading profile…</div>
    )
  }

  if (scrapeState.status === 'error') {
    return (
      <div className="p-4 w-72">
        <StatusMessage
          variant="error"
          message={`Could not read profile: ${scrapeState.message}`}
        />
      </div>
    )
  }

  const { contact } = scrapeState

  return (
    <div className="p-4 w-72 space-y-3">
      <ProfileCard contact={contact} />
      <CaptureButton
        disabled={captureState.status === 'saving' || captureState.status === 'saved'}
        loading={captureState.status === 'saving'}
        onClick={() => void capture(contact)}
      />
      {captureState.status === 'saved' && (
        <StatusMessage variant="success" message="Saved successfully" />
      )}
      {captureState.status === 'error' && (
        <StatusMessage variant="error" message={`Failed to save: ${captureState.message}`} />
      )}
    </div>
  )
}
