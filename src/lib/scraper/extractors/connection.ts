interface ConnectionResult {
  connectionDegree: string | null
  isConnected: boolean
  canConnect: boolean
  canMessage: boolean
  isPending: boolean
}

function extractDegree(): string | null {
  try {
    const degreeRe = /\b(1st|2nd|3rd\+?)\b/i

    // Check aria-labels first (most reliable)
    const degreeEl =
      document.querySelector('[aria-label*="1st degree" i]') ??
      document.querySelector('[aria-label*="2nd degree" i]') ??
      document.querySelector('[aria-label*="3rd degree" i]') ??
      document.querySelector('[aria-label*="degree connection" i]')

    if (degreeEl) {
      const label = degreeEl.getAttribute('aria-label') ?? ''
      const match = degreeRe.exec(label)
      if (match?.[1]) return match[1]
    }

    // Scan short span text nodes (degree badge is always short)
    const spans = document.querySelectorAll('span')
    for (const span of spans) {
      const text = span.textContent?.trim() ?? ''
      if (text.length > 15) continue
      const match = degreeRe.exec(text)
      if (match?.[1]) return match[1]
    }

    return null
  } catch {
    return null
  }
}

function buttonExists(ariaFragments: string[], textFragments: string[]): boolean {
  // Check by aria-label
  for (const fragment of ariaFragments) {
    if (document.querySelector(`button[aria-label*="${fragment}" i]`)) return true
  }
  // Check by visible button text
  const buttons = document.querySelectorAll('button')
  for (const btn of buttons) {
    const text = btn.textContent?.trim().toLowerCase() ?? ''
    for (const fragment of textFragments) {
      if (text === fragment.toLowerCase() || text.startsWith(fragment.toLowerCase())) return true
    }
  }
  return false
}

export function extractConnectionInfo(_doc: Document): ConnectionResult {
  const connectionDegree = extractDegree()
  const isConnected = connectionDegree === '1st'

  const isPending = buttonExists(
    ['Withdraw', 'pending invitation', 'Pending'],
    ['Pending'],
  )

  const canConnect =
    !isPending &&
    buttonExists(
      ['Invite', 'Connect with', 'connect'],
      ['Connect'],
    )

  const canMessage = buttonExists(['Message'], ['Message'])

  return { connectionDegree, isConnected, canConnect, canMessage, isPending }
}
