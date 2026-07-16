import { getTextContent, safeQuery } from '../utils'

interface IdentityResult {
  name: string | null
  headline: string | null
  role: string | null
  company: string | null
  location: string | null
}

function extractName(): string | null {
  try {
    const h1 = document.querySelector('h1')
    const fromH1 = getTextContent(h1)
    if (fromH1) return fromH1

    const ogTitle = safeQuery<HTMLMetaElement>(document, 'meta[property="og:title"]')
    if (ogTitle?.content) {
      return ogTitle.content.split('|')[0]?.trim() ?? null
    }

    return document.title.split('|')[0]?.trim() ?? null
  } catch {
    return null
  }
}

function extractHeadline(): string | null {
  try {
    const h1 = document.querySelector('h1')
    if (!h1) return null

    // Walk up from h1 to find its section container, then look for headline
    let container: Element | null = h1.parentElement
    for (let i = 0; i < 6; i++) {
      if (!container) break

      // LinkedIn renders headline in .text-body-medium right after the name block
      const candidate = container.querySelector('.text-body-medium')
      if (candidate) {
        const text = getTextContent(candidate)
        if (text && text.length > 3) return text
      }

      container = container.parentElement
    }

    // Fallback: first div/span sibling after h1 with substantial text (not a button, not a degree badge)
    let sibling = h1.nextElementSibling
    while (sibling) {
      if (sibling.tagName !== 'BUTTON') {
        const text = getTextContent(sibling)
        if (text && text.length > 10 && !/^\d/.test(text)) return text
      }
      sibling = sibling.nextElementSibling
    }

    return null
  } catch {
    return null
  }
}

function extractRoleAndCompany(): { role: string | null; company: string | null } {
  try {
    // Try the Experience section — LinkedIn uses id="experience" on a div inside a section
    const expAnchor =
      document.querySelector('#experience') ??
      document.querySelector('[id*="experience" i]')

    const expSection = expAnchor?.closest('section') ?? null

    if (expSection) {
      const items = expSection.querySelectorAll('li')
      const first = items[0]
      if (first) {
        // LinkedIn renders role title in a span[aria-hidden="true"] (first one = title)
        const ariaHiddenSpans = first.querySelectorAll('span[aria-hidden="true"]')
        const role = getTextContent(ariaHiddenSpans[0] ?? null)
        const company = getTextContent(ariaHiddenSpans[1] ?? null)
        if (role) return { role, company: company ?? null }
      }
    }

    // Fallback: look for any section whose h2 text includes "Experience"
    const sections = document.querySelectorAll('section')
    for (const section of sections) {
      const h2 = section.querySelector('h2')
      if (!getTextContent(h2)?.toLowerCase().includes('experience')) continue
      const first = section.querySelector('li')
      if (!first) continue
      const spans = first.querySelectorAll('span[aria-hidden="true"]')
      const role = getTextContent(spans[0] ?? null)
      const company = getTextContent(spans[1] ?? null)
      if (role) return { role, company: company ?? null }
    }

    // Last resort: parse headline "Title at Company"
    const headline = extractHeadline()
    if (headline) {
      const match = /^(.+?)\s+(?:at|@)\s+(.+)$/i.exec(headline)
      if (match) return { role: match[1]?.trim() ?? null, company: match[2]?.trim() ?? null }
    }

    return { role: null, company: null }
  } catch {
    return { role: null, company: null }
  }
}

function extractLocation(): string | null {
  try {
    const h1 = document.querySelector('h1')
    if (!h1) return null

    // Walk up to find the profile top card container
    let container: Element | null = h1.parentElement
    for (let i = 0; i < 6; i++) {
      if (!container) break

      // LinkedIn renders location in a span.text-body-small near the profile header
      const candidates = container.querySelectorAll('span.text-body-small, .text-body-small span')
      for (const el of candidates) {
        const text = getTextContent(el)
        if (!text) continue
        // Location typically has a comma or is a plain city/country — filter out connection counts
        if (/\d+\s*(connection|follower)/i.test(text)) continue
        if (text.length > 2 && text.length < 80) return text
      }

      container = container.parentElement
    }

    return null
  } catch {
    return null
  }
}

export function extractIdentity(_doc: Document): IdentityResult {
  const { role, company } = extractRoleAndCompany()
  return {
    name: extractName(),
    headline: extractHeadline(),
    role,
    company,
    location: extractLocation(),
  }
}
