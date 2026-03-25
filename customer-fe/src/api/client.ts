export class ApiError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export class UnauthorizedError extends ApiError {
  constructor() {
    super(401, 'Unauthorized')
    this.name = 'UnauthorizedError'
  }
}

export class NetworkError extends Error {
  constructor() {
    super('Network connection error')
    this.name = 'NetworkError'
  }
}

type TokenGetter = () => string | null

let getToken: TokenGetter = () => null

export function setTokenGetter(getter: TokenGetter) {
  getToken = getter
}

const baseUrl = import.meta.env.VITE_API_BASE_URL || ''

export async function apiRequest<T>(
  method: string,
  path: string,
  body?: unknown
): Promise<T> {
  const token = getToken()
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  let response: Response
  try {
    response = await fetch(`${baseUrl}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw new NetworkError()
  }

  if (response.status === 401) {
    throw new UnauthorizedError()
  }

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}))
    throw new ApiError(
      response.status,
      errorBody.message || `Server error (${response.status})`
    )
  }

  if (response.status === 204) {
    return undefined as T
  }

  return response.json()
}

export const api = {
  get<T>(path: string): Promise<T> {
    return apiRequest('GET', path)
  },
  post<T>(path: string, body: unknown): Promise<T> {
    return apiRequest('POST', path, body)
  },
  patch<T>(path: string, body: unknown): Promise<T> {
    return apiRequest('PATCH', path, body)
  },
  delete<T>(path: string): Promise<T> {
    return apiRequest('DELETE', path)
  },
}
