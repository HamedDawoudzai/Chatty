import { api } from '../axios'

export interface Message {
  id: string
  room_id: string
  author_id: string
  content: string
  thread_id?: string
  attachment_url?: string
  attachment_name?: string
  is_pinned: boolean
  is_edited: boolean
  is_deleted: boolean
  created_at: string
  updated_at: string
  author_username?: string
  author_display_name?: string
  author_avatar_url?: string
  reply_count: number
}

export interface MessagePage { items: Message[]; total: number; has_more: boolean }

export const getMessages = (roomId: string, params?: { limit?: number; before?: string }) =>
  api.get<MessagePage>(`/messages/rooms/${roomId}`, { params }).then(r => r.data)

export const searchMessages = (roomId: string, q: string) =>
  api.get<Message[]>(`/messages/rooms/${roomId}/search`, { params: { q } }).then(r => r.data)

export const editMessage = (id: string, content: string) =>
  api.patch<Message>(`/messages/${id}`, { content }).then(r => r.data)

export const deleteMessage = (id: string) => api.delete(`/messages/${id}`)

export const pinMessage = (id: string) => api.post<Message>(`/messages/${id}/pin`).then(r => r.data)

export const getReplies = (id: string) =>
  api.get<Message[]>(`/messages/${id}/replies`).then(r => r.data)

export const markRoomRead = (roomId: string) =>
  api.post(`/notifications/read-all`)
