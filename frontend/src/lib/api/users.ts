import { api } from '../axios'

export interface User {
  id: string
  username: string
  email: string
  display_name?: string
  avatar_url?: string
  bio?: string
  is_active: boolean
  created_at: string
}

export const getMe = () => api.get<User>('/users/me').then(r => r.data)
export const updateMe = (data: Partial<User>) =>
  api.patch<User>('/users/me', data).then(r => r.data)
export const searchUsers = (q: string) =>
  api.get<User[]>(`/users/search?q=${encodeURIComponent(q)}`).then(r => r.data)
export const getUser = (id: string) => api.get<User>(`/users/${id}`).then(r => r.data)
export const uploadAvatar = (file: File) => {
  const form = new FormData()
  form.append('file', file)
  return api.post<User>('/users/me/avatar', form).then(r => r.data)
}
