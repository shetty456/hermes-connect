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
      const parts = ogTitle.content.split('|')
      return parts[0]?.trim() ?? null
    }

    const titleText = document.title
    if (titleText) {
      const parts = titleText.split('|')
      return parts[0]?.trim() ?? null
    }

    return null
  } catch {
    return null
  }
}

function extractHeadline(): string | null {
  try {
    // LinkedIn renders headline in a div below the h1, typically with a class
    // we target it by looking for the first substantial text block after h1
    const h1 = document.querySelector('h1')
    if (!h1) return null

    // Walk siblings of h1's parent to find a headline-like element
    const parent = h1.closest('div, section')
    if (!parent) return null

    // Look for an element with aria-label containing 'headline' or specific data attributes
    const headlineEl =
      parent.querySelector('[data-field="headline"]') ??
      parent.querySelector('[aria-label*="headline" i]')

    if (headlineEl) return getTextContent(headlineEl)

    // Fallback: find the first div/span sibling after h1 with substantial text
    let sibling = h1.nextElementSibling
    while (sibling) {
      const text = getTextContent(sibling)
      if (text && text.length > 5 && !text.match(/^\d/)) return text
      sibling = sibling.nextElementSibling
    }

    return null
  } catch {
    return null
  }
}

function extractRoleAndCompany(): { role: string | null; company: string | null } {
  try {
    // Try to find the experience section
    const sections = document.querySelectorAll('section')
    for (const section of sections) {
      const heading = section.querySelector('h2, h3')
      const headingText = getTextContent(heading)
      if (!headingText?.toLowerCase().includes('experience')) continue

      // First list item in experience = current role
      const firstItem = section.querySelector('li')
      if (!firstItem) continue

      const roleEl =
        firstItem.querySelector('[data-field="title"]') ??
        firstItem.querySelector('span[aria-hidden="true"]') ??
        firstItem.querySelector('h3') ??
        firstItem.querySelector('h4')

      const companyEl =
        firstItem.querySelector('[data-field="subtitle"]') ??
        firstItem.querySelectorAll('span[aria-hidden="true"]')[1] ??
        null

      return {
        role: getTextContent(roleEl ?? null),
        company: getTextContent(companyEl ?? null),
      }
    }

    // Fallback: parse headline as "Role at Company"
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
    // LinkedIn shows location near the profile header as a button or span
    const locationEl =
      document.querySelector('[data-field="location"]') ??
      document.querySelector('button[aria-label*="location" i]') ??
      document.querySelector('span[aria-label*="location" i]')

    if (locationEl) return getTextContent(locationEl)

    // Fallback: look for city-like text near profile header
    const profileSection = document.querySelector('section.pv-top-card, .ph5.pb5')
    if (profileSection) {
      const spans = profileSection.querySelectorAll('span')
      for (const span of spans) {
        const text = getTextContent(span)
        // Location usually has a comma (City, Country) and no special chars
        if (text && /^[A-Za-z\s]+,\s*[A-Za-z\s]+$/.test(text) && text.length < 60) {
          return text
        }
      }
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
