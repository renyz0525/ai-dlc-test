import { describe, it, expect, vi, beforeEach } from 'vitest'
import { apiRequest, UnauthorizedError, ApiError, NetworkError } from '@/api/client'

const mockFetch = vi.fn()
global.fetch = mockFetch

describe('apiRequest', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('makes a successful GET request', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ data: 'test' }),
    })

    const result = await apiRequest('GET', '/api/test')
    expect(result).toEqual({ data: 'test' })
    expect(mockFetch).toHaveBeenCalledWith(
      '/api/test',
      expect.objectContaining({ method: 'GET' })
    )
  })

  it('throws UnauthorizedError on 401', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
    })

    await expect(apiRequest('GET', '/api/test')).rejects.toThrow(UnauthorizedError)
  })

  it('throws ApiError on 4xx/5xx', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: () => Promise.resolve({ message: 'Server error' }),
    })

    await expect(apiRequest('GET', '/api/test')).rejects.toThrow(ApiError)
  })

  it('throws NetworkError on fetch failure', async () => {
    mockFetch.mockRejectedValueOnce(new TypeError('Network request failed'))

    await expect(apiRequest('GET', '/api/test')).rejects.toThrow(NetworkError)
  })

  it('handles 204 No Content', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 204,
    })

    const result = await apiRequest('DELETE', '/api/test')
    expect(result).toBeUndefined()
  })
})
