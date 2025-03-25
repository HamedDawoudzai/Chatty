import { useEffect, useState, useCallback } from 'react'
import { getReplies } from '../lib/api/messages'
import { MessageBubble } from './MessageBubble'
import { MessageInput } from './MessageInput'
import { useAuth } from '../context/AuthContext'
import type { Message } from '../lib/api/messages'

interface ThreadPanelProps {
  parentMessage: Message
  send: (type: string, payload?: object) => void
  onClose: () => void
}

export function ThreadPanel({ parentMessage, send, onClose }: ThreadPanelProps) {
  const { user } = useAuth()
  const [replies, setReplies] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    getReplies(parentMessage.id).then(data => {
      if (!cancelled) { setReplies(data); setLoading(false) }
    })
    return () => { cancelled = true }
  }, [parentMessage.id])

  const handleSend = useCallback((content: string) => {
    const optimistic: Message = {
      id: `temp-${Date.now()}`,
      room_id: parentMessage.room_id,
      author_id: user!.id,
      content,
      thread_id: parentMessage.id,
      is_pinned: false, is_edited: false, is_deleted: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      author_username: user?.username,
      reply_count: 0,
    }
    setReplies(prev => [...prev, optimistic])
    send('message.new', { content, thread_id: parentMessage.id })
  }, [parentMessage, user, send])

  return (
    <div className="w-80 flex flex-col border-l border-gray-200 dark:border-gray-700 h-full">
      <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700">
        <span className="font-semibold text-sm">Thread</span>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
      </div>
      <div className="p-3 border-b border-gray-200 dark:border-gray-700">
        <MessageBubble message={parentMessage} isOwn={parentMessage.author_id === user?.id} />
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-1">
        {loading ? <p className="text-sm text-gray-400">Loading…</p>
          : replies.map(r => <MessageBubble key={r.id} message={r} isOwn={r.author_id === user?.id} />)
        }
      </div>
      <MessageInput onSend={handleSend} send={send} roomId={parentMessage.room_id} />
    </div>
  )
}
