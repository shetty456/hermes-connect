import type { AirtableErrorBody } from '@/types/airtable'

export class AirtableApiError extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly airtableType: string,
    message: string,
  ) {
    super(message)
    this.name = 'AirtableApiError'
  }
}

export async function airtableFetch<T>(
  url: string,
  token: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })

  if (!response.ok) {
    let errorBody: AirtableErrorBody | null = null
    try {
      errorBody = (await response.json()) as AirtableErrorBody
    } catch {
      throw new AirtableApiError(response.status, 'UNKNOWN', response.statusText)
    }
    throw new AirtableApiError(
      response.status,
      errorBody.error.type,
      errorBody.error.message,
    )
  }

  return response.json() as Promise<T>
}
