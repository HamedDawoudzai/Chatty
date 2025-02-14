import { useState, useRef, useCallback, useEffect } from 'react'
import { WS_EVENTS } from '../lib/wsEvents'
import { replaceShortcodes } from '../lib/emoji'

interface MessageInputProps {
  onSend: (content: string, attachmentUrl?: string) => void
  send: (type: string, payload?: object) => void
  roomId: string
}

export function MessageInput({ onSend, send, roomId }: MessageInputProps) {
  const [content, setContent] = useState('')
  const [sending, setSending] = useState(false)
  const typingTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isTyping = useRef(false)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const handleTyping = () => {
    if (!isTyping.current) {
      isTyping.current = true
      send(WS_EVENTS.TYPING_START, {})
    }
    if (typingTimer.current) clearTimeout(typingTimer.current)
    typingTimer.current = setTimeout(() => {
      isTyping.current = false
      send(WS_EVENTS.TYPING_STOP, {})
    }, 1500)
  }

  const handleSubmit = useCallback((e?: React.FormEvent) => {
    e?.preventDefault()
    const trimmed = replaceShortcodes(content.trim())
    if (!trimmed || sending) return
    setSending(true)
    onSend(trimmed)
    setContent('')
    setSending(false)
    if (typingTimer.current) clearTimeout(typingTimer.current)
    isTyping.current = false
    send(WS_EVENTS.TYPING_STOP, {})
  }, [content, onSend, send, sending])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 dark:border-gray-700">
      <div className="flex items-end gap-2 bg-gray-100 dark:bg-gray-800 rounded-xl px-3 py-2">
        <textarea
          ref={inputRef}
          value={content}
          onChange={e => { setContent(e.target.value); handleTyping() }}
          onKeyDown={handleKeyDown}
          placeholder="Message…"
          rows={1}
          className="flex-1 bg-transparent resize-none outline-none text-sm max-h-32 py-1"
        />
        <button type="submit" disabled={!content.trim() || sending}
          className="btn-primary px-3 py-1.5 text-sm disabled:opacity-50">
          Send
        </button>
      </div>
    </form>
  )
}
