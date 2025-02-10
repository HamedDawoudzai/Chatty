import { useEffect, useState, useCallback } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { getMyRooms, joinRoom } from '../lib/api/rooms'
import { useAuth } from '../context/AuthContext'
import { CreateRoomModal } from './CreateRoomModal'
import { ThemeToggle } from './ThemeToggle'
import type { Room } from '../lib/api/rooms'

export function Sidebar() {
  const { user, logout } = useAuth()
  const { roomId } = useParams()
  const navigate = useNavigate()
  const [rooms, setRooms] = useState<Room[]>([])
  const [showCreate, setShowCreate] = useState(false)

  const loadRooms = useCallback(() => {
    getMyRooms().then(setRooms)
  }, [])

  useEffect(() => { loadRooms() }, [loadRooms])

  const groupRooms = rooms.filter(r => r.type !== 'direct')
  const dmRooms = rooms.filter(r => r.type === 'direct')

  return (
    <aside className="w-64 flex flex-col bg-gray-800 text-gray-100 h-full">
      <div className="p-4 border-b border-gray-700">
        <h1 className="text-xl font-bold text-white">Chatty</h1>
      </div>
      <nav className="flex-1 overflow-y-auto p-2 space-y-1">
        <div className="flex items-center justify-between px-2 py-1">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Rooms</span>
          <button onClick={() => setShowCreate(true)} className="text-gray-400 hover:text-white text-lg leading-none">+</button>
        </div>
        {groupRooms.map(room => (
          <Link key={room.id} to={`/rooms/${room.id}`}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${roomId === room.id ? 'bg-gray-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}>
            <span className="text-gray-400">#</span>
            <span className="truncate">{room.name}</span>
          </Link>
        ))}
        {dmRooms.length > 0 && (
          <>
            <div className="px-2 py-1 mt-4">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Direct Messages</span>
            </div>
            {dmRooms.map(room => (
              <Link key={room.id} to={`/rooms/${room.id}`}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${roomId === room.id ? 'bg-gray-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}>
                <span className="w-2 h-2 rounded-full bg-green-400 flex-shrink-0" />
                <span className="truncate">{room.name || 'DM'}</span>
              </Link>
            ))}
          </>
        )}
      </nav>
      <div className="p-4 border-t border-gray-700 flex items-center gap-2">
        <Link to="/profile" className="flex items-center gap-2 flex-1 min-w-0 hover:text-white">
          <div className="w-8 h-8 rounded-full bg-brand-500 flex items-center justify-center text-sm font-bold flex-shrink-0">
            {user?.username?.[0]?.toUpperCase()}
          </div>
          <span className="text-sm truncate">{user?.display_name ?? user?.username}</span>
        </Link>
        <ThemeToggle />
        <button onClick={logout} className="text-gray-400 hover:text-white text-sm">✕</button>
      </div>
      {showCreate && <CreateRoomModal onClose={() => { setShowCreate(false); loadRooms() }} />}
    </aside>
  )
}
