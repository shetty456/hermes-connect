interface BadgesResult {
  openToWork: boolean
  premium: boolean
}

function extractOpenToWork(): boolean {
  try {
    if (
      document.querySelector('[aria-label*="open to work" i]') ??
      document.querySelector('[aria-label*="opentowork" i]')
    )
      return true

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
    // aria-label on the premium badge icon
    if (
      document.querySelector('[aria-label*="LinkedIn Premium" i]') ??
      document.querySelector('[aria-label*="Premium member" i]')
    )
      return true

    // SVG title inside the premium gold icon
    const svgTitles = document.querySelectorAll('svg title, svg desc')
    for (const el of svgTitles) {
      const text = el.textContent?.toLowerCase() ?? ''
      if (text.includes('premium') || text.includes('career') || text.includes('gold')) return true
    }

    // LinkedIn Premium icon has a specific li:premium class or similar
    if (document.querySelector('[class*="premium" i]')) return true

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
