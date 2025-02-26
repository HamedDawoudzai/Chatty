import { useState } from 'react'
import { SearchBar } from './SearchBar'
import { RoomSettings } from './RoomSettings'
import { PinnedMessage } from './PinnedMessage'

interface RoomHeaderProps {
  roomId: string
  onlineCount: number
  onSearch: (q: string) => void
}

export function RoomHeader({ roomId, onlineCount, onSearch }: RoomHeaderProps) {
  const [showSettings, setShowSettings] = useState(false)
  return (
    <header className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-semibold truncate">Room</span>
          <span className="text-xs text-green-500">{onlineCount} online</span>
        </div>
        <PinnedMessage roomId={roomId} />
      </div>
      <SearchBar onSearch={onSearch} />
      <button onClick={() => setShowSettings(true)} className="btn-ghost text-sm px-2">⚙</button>
      {showSettings && <RoomSettings roomId={roomId} onClose={() => setShowSettings(false)} />}
    </header>
  )
}
