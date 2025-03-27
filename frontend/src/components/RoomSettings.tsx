import { useState } from 'react'
import { updateRoom, leaveRoom } from '../lib/api/rooms'
import { useNavigate } from 'react-router-dom'

interface RoomSettingsProps { roomId: string; onClose: () => void }

export function RoomSettings({ roomId, onClose }: RoomSettingsProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const navigate = useNavigate()

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    await updateRoom(roomId, { name: name || undefined, description: description || undefined })
    onClose()
  }

  const handleLeave = async () => {
    await leaveRoom(roomId)
    navigate('/')
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md shadow-xl">
        <h2 className="text-lg font-semibold mb-4">Room Settings</h2>
        <form onSubmit={handleSave} className="space-y-3">
          <input className="input" placeholder="New name" value={name} onChange={e => setName(e.target.value)} />
          <input className="input" placeholder="New description" value={description} onChange={e => setDescription(e.target.value)} />
          <div className="flex gap-2 pt-2">
            <button type="submit" className="btn-primary flex-1">Save</button>
            <button type="button" onClick={onClose} className="btn-ghost flex-1">Cancel</button>
          </div>
        </form>
        <hr className="my-4 border-gray-200 dark:border-gray-700" />
        <button onClick={handleLeave} className="text-red-500 hover:underline text-sm w-full text-center">
          Leave room
        </button>
      </div>
    </div>
  )
}
