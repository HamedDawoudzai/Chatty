import { useState } from 'react'
import { createRoom } from '../lib/api/rooms'

interface CreateRoomModalProps { onClose: () => void }

export function CreateRoomModal({ onClose }: CreateRoomModalProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [type, setType] = useState('public')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await createRoom({ name, description, type })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md shadow-xl">
        <h2 className="text-lg font-semibold mb-4">Create Room</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input className="input" placeholder="Room name" value={name}
            onChange={e => setName(e.target.value)} required />
          <input className="input" placeholder="Description (optional)"
            value={description} onChange={e => setDescription(e.target.value)} />
          <select className="input" value={type} onChange={e => setType(e.target.value)}>
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>
          <div className="flex gap-2 pt-2">
            <button type="submit" disabled={loading} className="btn-primary flex-1">Create</button>
            <button type="button" onClick={onClose} className="btn-ghost flex-1">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  )
}
