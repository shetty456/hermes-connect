export interface Contact {
  name: string
  headline: string | null
  role: string | null
  company: string | null
  location: string | null
  profileUrl: string
  connectionDegree: string | null
  isConnected: boolean
  canConnect: boolean
  canMessage: boolean
  isPending: boolean
  canFollow: boolean
  mutualConnections: number | null
  mutualGroups: string[]
  openToWork: boolean
  premium: boolean
  capturedAt: string
}

export interface ContactRepository {
  findByProfileUrl(profileUrl: string): Promise<Contact | null>
  create(contact: Contact): Promise<void>
  update(contact: Contact): Promise<void>
}
