import { findButtonByText } from '../utils'

interface SocialResult {
  canFollow: boolean
  mutualConnections: number | null
  mutualGroups: string[]
}

function extractMutualConnections(): number | null {
  try {
    const mutualRe = /(\d+)\s+mutual\s+connection/i
    // Search all text nodes
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
    let node: Node | null = walker.nextNode()
    while (node) {
      const text = node.textContent?.trim() ?? ''
      const match = mutualRe.exec(text)
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

    // Search for sections or elements that mention mutual groups
    const allEls = document.querySelectorAll('li, div, span')
    for (const el of allEls) {
      const parent = el.closest('section, aside, div[class]')
      if (!parent) continue
      const parentText = parent.textContent ?? ''
      if (!mutualGroupRe.test(parentText)) continue

      // Collect anchor or span text that looks like a group name
      const links = parent.querySelectorAll('a, span[aria-hidden="true"]')
      for (const link of links) {
        const text = link.textContent?.trim()
        if (text && text.length > 2 && !mutualGroupRe.test(text) && !groups.includes(text)) {
          groups.push(text)
        }
      }
      if (groups.length > 0) break
    }

    return groups
  } catch {
    return []
  }
}

function extractCanFollow(): boolean {
  try {
    const byText = findButtonByText(document, 'Follow') !== null
    if (byText) return true
    const byAria = document.querySelector('button[aria-label*="Follow" i]') !== null
    return byAria
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
