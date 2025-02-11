import { api } from '../axios'

export interface Room {
  id: string
  name: string
  description?: string
  type: 'public' | 'private' | 'direct'
  created_by: string
  created_at: string
  member_count: number
}

export interface CreateRoomData { name: string; description?: string; type?: string }

export const getRooms = () => api.get<Room[]>('/rooms').then(r => r.data)
export const getMyRooms = () => api.get<Room[]>('/rooms/mine').then(r => r.data)
export const createRoom = (data: CreateRoomData) => api.post<Room>('/rooms', data).then(r => r.data)
export const joinRoom = (id: string) => api.post<Room>(`/rooms/${id}/join`).then(r => r.data)
export const leaveRoom = (id: string) => api.post(`/rooms/${id}/leave`)
export const updateRoom = (id: string, data: Partial<CreateRoomData>) =>
  api.patch<Room>(`/rooms/${id}`, data).then(r => r.data)
export const createDM = (targetId: string) =>
  api.post<Room>(`/rooms/dm?target_id=${targetId}`).then(r => r.data)
