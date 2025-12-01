import type { ApiUser, AuthPayload } from '../types'

const API_URL = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, '') || 'http://localhost:8000'

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init.headers,
    },
  })

  const text = await response.text()
  const data = text ? JSON.parse(text) : null

  if (!response.ok) {
    const detail = data?.detail || response.statusText
    throw new Error(typeof detail === 'string' ? detail : 'Request failed')
  }

  return data as T
}

export function apiLogin(email: string, password: string) {
  return request<AuthPayload>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
}

export function apiRegister(email: string, password: string) {
  return request<AuthPayload>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
}

export function apiProfile(token: string) {
  return request<ApiUser>('/users/me', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}
