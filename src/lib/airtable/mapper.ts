import type { Contact } from '@/types/contact'
import type { AirtableFields } from '@/types/airtable'

export function contactToFields(contact: Contact): AirtableFields {
  return {
    name: contact.name,
    headline: contact.headline,
    role: contact.role,
    company: contact.company,
    location: contact.location,
    profileUrl: contact.profileUrl,
    connectionDegree: contact.connectionDegree,
    isConnected: contact.isConnected,
    canConnect: contact.canConnect,
    canMessage: contact.canMessage,
    isPending: contact.isPending,
    canFollow: contact.canFollow,
    mutualConnections: contact.mutualConnections,
    mutualGroups: contact.mutualGroups.join(', '),
    openToWork: contact.openToWork,
    premium: contact.premium,
    capturedAt: contact.capturedAt,
  }
}

export function fieldsToContact(fields: AirtableFields): Contact {
  return {
    name: fields.name ?? 'Unknown',
    headline: fields.headline ?? null,
    role: fields.role ?? null,
    company: fields.company ?? null,
    location: fields.location ?? null,
    profileUrl: fields.profileUrl,
    connectionDegree: fields.connectionDegree ?? null,
    isConnected: fields.isConnected ?? false,
    canConnect: fields.canConnect ?? false,
    canMessage: fields.canMessage ?? false,
    isPending: fields.isPending ?? false,
    canFollow: fields.canFollow ?? false,
    mutualConnections: fields.mutualConnections ?? null,
    mutualGroups: fields.mutualGroups
      ? fields.mutualGroups.split(', ').filter(Boolean)
      : [],
    openToWork: fields.openToWork ?? false,
    premium: fields.premium ?? false,
    capturedAt: fields.capturedAt ?? new Date().toISOString(),
  }
}
