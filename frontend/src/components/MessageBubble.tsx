import { useState } from 'react'
import { Avatar } from './Avatar'
import type { Message } from '../lib/api/messages'

interface MessageBubbleProps {
  message: Message
  isOwn: boolean
  onThreadOpen?: (msg: Message) => void
  searchQuery?: string
}

function highlight(text: string, query: string): React.ReactNode {
  if (!query) return text
  const parts = text.split(new RegExp(`(${query})`, 'gi'))
  return parts.map((p, i) =>
    p.toLowerCase() === query.toLowerCase()
      ? <mark key={i} className="bg-yellow-200 dark:bg-yellow-700">{p}</mark>
      : p
  )
}

function renderContent(text: string) {
  return text
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/@(\w+)/g, '<span class="text-brand-500 font-medium">@$1</span>')
    .replace(/#(\w+)/g, '<span class="text-brand-400 cursor-pointer">#$1</span>')
}

export function MessageBubble({ message, isOwn, onThreadOpen, searchQuery }: MessageBubbleProps) {
  const [showActions, setShowActions] = useState(false)
  const [editing, setEditing] = useState(false)
  const [editContent, setEditContent] = useState(message.content)
  const name = message.author_display_name ?? message.author_username ?? 'Unknown'
  const time = new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

  if (message.is_deleted) {
    return <div className="flex gap-2 py-1 px-2 opacity-50 italic text-sm">[deleted]</div>
  }

  return (
    <div onMouseEnter={() => setShowActions(true)} onMouseLeave={() => setShowActions(false)}
      className={`flex gap-3 py-1 px-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 group ${isOwn ? 'flex-row-reverse' : ''}`}>
      <Avatar name={name} src={message.author_avatar_url} size="sm" />
      <div className={`flex flex-col max-w-[70%] ${isOwn ? 'items-end' : ''}`}>
        <div className="flex items-baseline gap-2 mb-0.5">
          <span className="text-xs font-semibold">{name}</span>
          <span className="text-xs text-gray-400">{time}</span>
          {message.is_edited && <span className="text-xs text-gray-400">(edited)</span>}
          {message.is_pinned && <span className="text-xs text-yellow-500">📌</span>}
        </div>
        <div className={`px-3 py-2 rounded-2xl text-sm ${isOwn ? 'bg-brand-500 text-white rounded-tr-sm' : 'bg-gray-100 dark:bg-gray-700 rounded-tl-sm'}`}>
          {searchQuery
            ? highlight(message.content, searchQuery)
            : <span dangerouslySetInnerHTML={{ __html: renderContent(message.content) }} />
          }
        </div>
        {message.attachment_url && (
          message.attachment_type?.startsWith('image/')
            ? <img src={message.attachment_url} alt={message.attachment_name ?? 'attachment'}
                className="mt-1 max-w-xs rounded-lg" />
            : <a href={message.attachment_url} target="_blank" rel="noreferrer"
                className="text-xs text-brand-500 hover:underline mt-1">{message.attachment_name}</a>
        )}
        {message.reply_count > 0 && (
          <button onClick={() => onThreadOpen?.(message)}
            className="text-xs text-brand-500 hover:underline mt-1">
            {message.reply_count} {message.reply_count === 1 ? 'reply' : 'replies'}
          </button>
        )}
      </div>
    </div>
  )
}
