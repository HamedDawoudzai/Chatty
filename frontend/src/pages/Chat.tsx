import { useEffect, useState, useRef, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getMessages } from '../lib/api/messages'
import { MessageList } from '../components/MessageList'
import { MessageInput } from '../components/MessageInput'
import { RoomHeader } from '../components/RoomHeader'
import { TypingIndicator } from '../components/TypingIndicator'
import { useWebSocket } from '../hooks/useWebSocket'
import { useMessageEvents } from '../hooks/useMessageEvents'
import { WS_EVENTS } from '../lib/wsEvents'
import type { Message } from '../lib/api/messages'

export default function Chat() {
  const { roomId } = useParams<{ roomId: string }>()
  const { user, token } = useAuth()
  const [messages, setMessages] = useState<Message[]>([])
  const [typingUsers, setTypingUsers] = useState<string[]>([])
  const [onlineCount, setOnlineCount] = useState(0)
  const [hasMore, setHasMore] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Message[]>([])
  const [threadMessage, setThreadMessage] = useState<Message | null>(null)

  const { send, on, isConnected } = useWebSocket(roomId!, token)
  useMessageEvents({ on, setMessages, setTypingUsers, setOnlineCount })

  useEffect(() => {
    if (!roomId) return
    setMessages([])
    getMessages(roomId).then(page => {
      setMessages(page.items)
      setHasMore(page.has_more)
    })
  }, [roomId])

  const loadMore = useCallback(async () => {
    if (!roomId || !hasMore || loadingMore || !messages.length) return
    setLoadingMore(true)
    const page = await getMessages(roomId, { before: messages[0]?.id })
    setMessages(prev => [...page.items, ...prev])
    setHasMore(page.has_more)
    setLoadingMore(false)
  }, [roomId, hasMore, loadingMore, messages])

  const handleSend = useCallback((content: string, attachmentUrl?: string) => {
    const optimistic: Message = {
      id: `temp-${Date.now()}`,
      room_id: roomId!,
      author_id: user!.id,
      content,
      is_pinned: false, is_edited: false, is_deleted: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      author_username: user?.username,
      author_display_name: user?.display_name,
      author_avatar_url: user?.avatar_url,
      reply_count: 0,
    }
    setMessages(prev => [...prev, optimistic])
    send(WS_EVENTS.MESSAGE_NEW, { content, attachment_url: attachmentUrl })
    setTimeout(() => {
      setMessages(prev => prev.filter(m => m.id !== optimistic.id))
    }, 5000)
  }, [roomId, user, send])

  return (
    <div className="flex flex-col h-full">
      <RoomHeader roomId={roomId!} onlineCount={onlineCount} onSearch={setSearchQuery} />
      <MessageList
        messages={searchQuery ? searchResults : messages}
        currentUserId={user?.id ?? ''}
        hasMore={hasMore}
        onLoadMore={loadMore}
        onThreadOpen={setThreadMessage}
        searchQuery={searchQuery}
      />
      <TypingIndicator users={typingUsers} />
      <MessageInput onSend={handleSend} send={send} roomId={roomId!} />
    </div>
  )
}
