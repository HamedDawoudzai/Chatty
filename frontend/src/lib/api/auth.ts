import { api } from '../axios'

export interface LoginCredentials { username: string; password: string }
export interface RegisterData { username: string; email: string; password: string }
export interface AuthToken { access_token: string; token_type: string }

export async function login(creds: LoginCredentials): Promise<AuthToken> {
  const form = new URLSearchParams()
  form.append('username', creds.username)
  form.append('password', creds.password)
  const { data } = await api.post<AuthToken>('/auth/login', form, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })
  return data
}

export async function register(data: RegisterData) {
  const { data: user } = await api.post('/auth/register', data)
  return user
}
