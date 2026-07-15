const LINKEDIN_PROFILE_RE = /^https:\/\/www\.linkedin\.com\/in\/[^/?#]+/

export function isLinkedInProfile(url: string): boolean {
  return LINKEDIN_PROFILE_RE.test(url)
}
