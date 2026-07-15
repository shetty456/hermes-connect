interface BadgesResult {
  openToWork: boolean
  premium: boolean
}

function extractOpenToWork(): boolean {
  try {
    // Open To Work badge appears as a frame/overlay on profile photo
    const byAriaLabel =
      document.querySelector('[aria-label*="open to work" i]') !== null ||
      document.querySelector('[aria-label*="#OPENTOWORK" i]') !== null

    if (byAriaLabel) return true

    // Fallback: look for badge text
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
    let node: Node | null = walker.nextNode()
    while (node) {
      const text = node.textContent?.trim().toLowerCase() ?? ''
      if (text === 'open to work' || text === '#opentowork') return true
      node = walker.nextNode()
    }

    return false
  } catch {
    return false
  }
}

function extractPremium(): boolean {
  try {
    // Premium badge: LinkedIn Premium icon near the name
    const byAriaLabel =
      document.querySelector('[aria-label*="LinkedIn Premium" i]') !== null ||
      document.querySelector('[aria-label*="Premium member" i]') !== null

    if (byAriaLabel) return true

    // SVG title approach
    const svgTitles = document.querySelectorAll('svg title')
    for (const title of svgTitles) {
      const text = title.textContent?.toLowerCase() ?? ''
      if (text.includes('premium') || text.includes('career')) return true
    }

    return false
  } catch {
    return false
  }
}

export function extractBadges(_doc: Document): BadgesResult {
  return {
    openToWork: extractOpenToWork(),
    premium: extractPremium(),
  }
}
