import type { Contact, ContactRepository } from '@/types/contact'
import type { AirtableListResponse, AirtableCreateResponse } from '@/types/airtable'
import type { StoredSettings } from '@/types/settings'
import { airtableFetch } from './client'
import { contactToFields, fieldsToContact } from './mapper'

export class AirtableRepository implements ContactRepository {
  private readonly baseUrl: string
  private readonly token: string

  constructor(settings: StoredSettings) {
    this.baseUrl = `https://api.airtable.com/v0/${settings.baseId}/${encodeURIComponent(settings.tableName)}`
    this.token = settings.personalAccessToken
  }

  async findByProfileUrl(profileUrl: string): Promise<Contact | null> {
    const safeUrl = profileUrl.replace(/'/g, "\\'")
    const formula = `{profileUrl}='${safeUrl}'`
    const query = new URLSearchParams({ filterByFormula: formula, maxRecords: '1' })
    const url = `${this.baseUrl}?${query.toString()}`

    const response = await airtableFetch<AirtableListResponse>(url, this.token)
    const record = response.records[0]
    if (!record) return null
    return fieldsToContact(record.fields)
  }

  async create(contact: Contact): Promise<void> {
    await airtableFetch<AirtableCreateResponse>(this.baseUrl, this.token, {
      method: 'POST',
      body: JSON.stringify({ fields: contactToFields(contact) }),
    })
  }

  async update(contact: Contact): Promise<void> {
    const safeUrl = contact.profileUrl.replace(/'/g, "\\'")
    const formula = `{profileUrl}='${safeUrl}'`
    const query = new URLSearchParams({
      filterByFormula: formula,
      maxRecords: '1',
      'fields[]': 'profileUrl',
    })
    const listUrl = `${this.baseUrl}?${query.toString()}`
    const listResponse = await airtableFetch<AirtableListResponse>(listUrl, this.token)
    const record = listResponse.records[0]

    if (!record) throw new Error('Cannot update: record not found in Airtable')

    await airtableFetch(`${this.baseUrl}/${record.id}`, this.token, {
      method: 'PATCH',
      body: JSON.stringify({ fields: contactToFields(contact) }),
    })
  }
}
