import type { Contact } from '@/types/contact'
import { extractIdentity } from './extractors/identity'
import { extractConnectionInfo } from './extractors/connection'
import { extractSocialInfo } from './extractors/social'
import { extractBadges } from './extractors/badges'

export function scrapeProfile(): Contact {
  const profileUrl = window.location.href.replace(/\?.*$/, '')

  const identity = extractIdentity(document)
  const connection = extractConnectionInfo(document)
  const social = extractSocialInfo(document)
  const badges = extractBadges(document)

  return {
    name: identity.name ?? 'Unknown',
    headline: identity.headline,
    role: identity.role,
    company: identity.company,
    location: identity.location,
    profileUrl,
    connectionDegree: connection.connectionDegree,
    isConnected: connection.isConnected,
    canConnect: connection.canConnect,
    canMessage: connection.canMessage,
    isPending: connection.isPending,
    canFollow: social.canFollow,
    mutualConnections: social.mutualConnections,
    mutualGroups: social.mutualGroups,
    openToWork: badges.openToWork,
    premium: badges.premium,
    capturedAt: new Date().toISOString(),
  }
}
