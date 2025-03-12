import { useState } from 'react'
import { searchUsers } from '../lib/api/users'
import { createDM } from '../lib/api/rooms'
import { useNavigate } from 'react-router-dom'
import type { User } from '../lib/api/users'

interface NewDMModalProps { onClose: () => void }

export function NewDMModal({ onClose }: NewDMModalProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<User[]>([])
  const navigate = useNavigate()

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
    if (e.target.value.length >= 2) {
      const users = await searchUsers(e.target.value)
      setResults(users)
    }
  }

  const startDM = async (userId: string) => {
    const room = await createDM(userId)
    navigate(`/rooms/${room.id}`)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-sm shadow-xl">
        <h2 className="text-lg font-semibold mb-3">New Direct Message</h2>
        <input className="input mb-3" placeholder="Search users…" value={query} onChange={handleSearch} autoFocus />
        <div className="space-y-1 max-h-48 overflow-y-auto">
          {results.map(u => (
            <button key={u.id} onClick={() => startDM(u.id)}
              className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-sm text-left">
              <div className="w-8 h-8 rounded-full bg-brand-500 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                {u.username[0].toUpperCase()}
              </div>
              <div>
                <p className="font-medium">{u.display_name ?? u.username}</p>
                <p className="text-gray-400 text-xs">@{u.username}</p>
              </div>
            </button>
          ))}
        </div>
        <button onClick={onClose} className="btn-ghost w-full mt-3">Cancel</button>
      </div>
    </div>
  )
}
