import type { LoginRequest, LoginResponse } from '@/types'

export async function mockLogin(request: LoginRequest): Promise<LoginResponse> {
  await new Promise((r) => setTimeout(r, 300))

  if (request.storeId && request.tableNumber && request.password) {
    return {
      token: 'mock-jwt-token-' + Date.now(),
      tableId: `table-${request.tableNumber}`,
      sessionId: 'session-' + Date.now(),
    }
  }

  throw new Error('Invalid credentials')
}
