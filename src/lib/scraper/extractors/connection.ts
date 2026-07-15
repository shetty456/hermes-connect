import { findButtonByText } from '../utils'

interface ConnectionResult {
  connectionDegree: string | null
  isConnected: boolean
  canConnect: boolean
  canMessage: boolean
  isPending: boolean
}

function extractDegree(): string | null {
  try {
    // Degree badge appears as "• 1st", "• 2nd", "• 3rd+" near the profile name
    const degreeRe = /\b(1st|2nd|3rd\+?)\b/i
    const allSpans = document.querySelectorAll('span')
    for (const span of allSpans) {
      const text = span.textContent?.trim() ?? ''
      const match = degreeRe.exec(text)
      if (match && text.length < 20) return match[1] ?? null
    }

    // Try aria-label approach
    const degreeEl = document.querySelector('[aria-label*="degree connection" i]')
    if (degreeEl) {
      const labelText = degreeEl.getAttribute('aria-label') ?? ''
      const match = degreeRe.exec(labelText)
      if (match) return match[1] ?? null
    }

    return null
  } catch {
    return null
  }
}

function hasButton(texts: string[]): boolean {
  for (const text of texts) {
    const btn = findButtonByText(document, text)
    if (btn && !btn.disabled) return true
  }
  return false
}

function hasAriaButton(labelFragment: string): boolean {
  try {
    const el = document.querySelector(`button[aria-label*="${labelFragment}" i]`)
    return el !== null
  } catch {
    return false
  }
}

export function extractConnectionInfo(_doc: Document): ConnectionResult {
  const connectionDegree = extractDegree()
  const isConnected = connectionDegree === '1st'

  // Check for pending first (Withdraw/Pending button takes precedence)
  const isPending =
    hasButton(['Pending']) ||
    hasAriaButton('Withdraw') ||
    hasAriaButton('pending invitation')

  const canConnect =
    !isPending &&
    (hasButton(['Connect']) || hasAriaButton('Connect with') || hasAriaButton('Invite'))

  const canMessage = hasButton(['Message']) || hasAriaButton('Message')

  return { connectionDegree, isConnected, canConnect, canMessage, isPending }
}
