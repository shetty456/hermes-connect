export interface AirtableFields {
  name?: string
  headline?: string | null
  role?: string | null
  company?: string | null
  location?: string | null
  profileUrl: string
  connectionDegree?: string | null
  isConnected?: boolean
  canConnect?: boolean
  canMessage?: boolean
  isPending?: boolean
  canFollow?: boolean
  mutualConnections?: number | null
  mutualGroups?: string
  openToWork?: boolean
  premium?: boolean
  capturedAt?: string
}

export interface AirtableRecord {
  id: string
  fields: AirtableFields
  createdTime: string
}

export interface AirtableListResponse {
  records: AirtableRecord[]
  offset?: string
}

export interface AirtableCreateResponse {
  id: string
  fields: AirtableFields
  createdTime: string
}

export interface AirtableErrorBody {
  error: {
    type: string
    message: string
  }
}
