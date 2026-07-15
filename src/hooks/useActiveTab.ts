import { useEffect, useState } from 'react'

interface ActiveTab {
  id: number
  url: string
}

export function useActiveTab(): ActiveTab | null {
  const [tab, setTab] = useState<ActiveTab | null>(null)

  useEffect(() => {
    chrome.tabs
      .query({ active: true, currentWindow: true })
      .then((tabs) => {
        const activeTab = tabs[0]
        if (activeTab?.id != null && activeTab.url != null) {
          setTab({ id: activeTab.id, url: activeTab.url })
        }
      })
      .catch(() => {
        // tabs API unavailable outside extension context
      })
  }, [])

  return tab
}
