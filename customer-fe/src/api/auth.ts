import type { LoginRequest, LoginResponse } from '@/types'
import { api } from './client'
import { mockLogin } from './mock/auth'

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

export async function login(request: LoginRequest): Promise<LoginResponse> {
  if (USE_MOCK) {
    return mockLogin(request)
  }
  return api.post<LoginResponse>('/api/auth/table/login', request)
}
