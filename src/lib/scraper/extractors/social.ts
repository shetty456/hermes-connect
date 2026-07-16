interface SocialResult {
  canFollow: boolean
  mutualConnections: number | null
  mutualGroups: string[]
}

function extractMutualConnections(): number | null {
  try {
    const mutualRe = /(\d+)\s+mutual\s+connection/i
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
    let node: Node | null = walker.nextNode()
    while (node) {
      const match = mutualRe.exec(node.textContent ?? '')
      if (match?.[1]) return parseInt(match[1], 10)
      node = walker.nextNode()
    }
    return null
  } catch {
    return null
  }
}

function extractMutualGroups(): string[] {
  try {
    const groups: string[] = []
    const mutualGroupRe = /mutual group/i

    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
    let node: Node | null = walker.nextNode()
    while (node) {
      if (mutualGroupRe.test(node.textContent ?? '')) {
        // Collect sibling/nearby anchor text as group names
        const parent = node.parentElement?.closest('li, div, section')
        if (parent) {
          const links = parent.querySelectorAll('a')
          for (const link of links) {
            const text = link.textContent?.trim()
            if (text && text.length > 2 && !mutualGroupRe.test(text) && !groups.includes(text)) {
              groups.push(text)
            }
          }
        }
        if (groups.length > 0) break
      }
      node = walker.nextNode()
    }
    return groups
  } catch {
    return []
  }
}

function extractCanFollow(): boolean {
  try {
    if (document.querySelector('button[aria-label*="Follow" i]')) return true
    const buttons = document.querySelectorAll('button')
    for (const btn of buttons) {
      const text = btn.textContent?.trim().toLowerCase()
      if (text === 'follow') return true
    }
    return false
  } catch {
    return false
  }
}

export function extractSocialInfo(_doc: Document): SocialResult {
  return {
    canFollow: extractCanFollow(),
    mutualConnections: extractMutualConnections(),
    mutualGroups: extractMutualGroups(),
  }
}
