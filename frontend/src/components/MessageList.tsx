import { useRef, useEffect } from 'react'
import { MessageBubble } from './MessageBubble'
import { MessageListSkeleton } from './MessageListSkeleton'
import type { Message } from '../lib/api/messages'

interface MessageListProps {
  messages: Message[]
  currentUserId: string
  hasMore: boolean
  onLoadMore: () => void
  onThreadOpen?: (msg: Message) => void
  searchQuery?: string
}

export function MessageList({ messages, currentUserId, hasMore, onLoadMore, onThreadOpen, searchQuery }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const prevScrollHeight = useRef(0)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length])

  const handleScroll = () => {
    if (!containerRef.current) return
    if (containerRef.current.scrollTop < 100 && hasMore) {
      prevScrollHeight.current = containerRef.current.scrollHeight
      onLoadMore()
    }
  }

  useEffect(() => {
    if (!containerRef.current) return
    const newScrollHeight = containerRef.current.scrollHeight
    if (prevScrollHeight.current && newScrollHeight > prevScrollHeight.current) {
      containerRef.current.scrollTop = newScrollHeight - prevScrollHeight.current
      prevScrollHeight.current = 0
    }
  })

  if (!messages.length) return <MessageListSkeleton />

  return (
    <div ref={containerRef} onScroll={handleScroll}
      className="flex-1 overflow-y-auto p-4 space-y-1">
      {hasMore && (
        <button onClick={onLoadMore} className="w-full text-center text-sm text-brand-500 hover:underline py-2">
          Load more
        </button>
      )}
      {messages.map(msg => (
        <MessageBubble key={msg.id} message={msg} isOwn={msg.author_id === currentUserId}
          onThreadOpen={onThreadOpen} searchQuery={searchQuery} />
      ))}
      <div ref={bottomRef} />
    </div>
  )
}
