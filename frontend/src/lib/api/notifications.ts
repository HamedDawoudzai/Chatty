import { api } from '../axios'

export interface Notification {
  id: string
  type: string
  title: string
  body?: string
  is_read: boolean
  created_at: string
}

export const getNotifications = () =>
  api.get<Notification[]>('/notifications').then(r => r.data)
export const markRead = (id: string) => api.post(`/notifications/${id}/read`)
export const markAllRead = () => api.post('/notifications/read-all')
