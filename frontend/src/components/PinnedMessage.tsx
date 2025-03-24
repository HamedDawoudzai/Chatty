import { useEffect, useState } from 'react'
import { getMessages } from '../lib/api/messages'
import type { Message } from '../lib/api/messages'

interface PinnedMessageProps { roomId: string }

export function PinnedMessage({ roomId }: PinnedMessageProps) {
  const [pinned, setPinned] = useState<Message | null>(null)

  useEffect(() => {
    getMessages(roomId, { limit: 100 }).then(page => {
      const p = page.items.find(m => m.is_pinned)
      setPinned(p ?? null)
    })
  }, [roomId])

  if (!pinned) return null
  return (
    <div className="text-xs text-yellow-600 dark:text-yellow-400 flex items-center gap-1 truncate">
      <span>📌</span>
      <span className="truncate">{pinned.content}</span>
    </div>
  )
}
