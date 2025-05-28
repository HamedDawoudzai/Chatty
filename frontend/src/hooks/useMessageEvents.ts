import { useEffect, useCallback } from 'react'
import { WS_EVENTS } from '../lib/wsEvents'
import type { Message } from '../lib/api/messages'

interface Params {
  on: (type: string, handler: (data: any) => void) => () => void
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>
  setTypingUsers: React.Dispatch<React.SetStateAction<string[]>>
  setOnlineCount: React.Dispatch<React.SetStateAction<number>>
}

export function useMessageEvents({ on, setMessages, setTypingUsers, setOnlineCount }: Params) {
  useEffect(() => {
    const unsubs = [
      on(WS_EVENTS.MESSAGE_NEW, ({ message }) => {
        setMessages(prev => {
          if (prev.some(m => m.id === message.id)) return prev
          return [...prev, message]
        })
      }),
      on(WS_EVENTS.MESSAGE_EDIT, ({ message }) => {
        setMessages(prev => prev.map(m => m.id === message.id ? { ...m, ...message } : m))
      }),
      on(WS_EVENTS.MESSAGE_DELETE, ({ message_id }) => {
        setMessages(prev => prev.filter(m => m.id !== message_id))
      }),
      on(WS_EVENTS.TYPING_START, ({ username }) => {
        setTypingUsers(prev => prev.includes(username) ? prev : [...prev, username])
      }),
      on(WS_EVENTS.TYPING_STOP, ({ user_id }) => {
        setTypingUsers(prev => prev.filter(u => u !== user_id))
      }),
      on(WS_EVENTS.PRESENCE_JOIN, ({ online_count }) => setOnlineCount(online_count)),
      on(WS_EVENTS.PRESENCE_LEAVE, ({ online_count }) => setOnlineCount(online_count)),
    ]
    return () => unsubs.forEach(u => u())
  }, [on, setMessages, setTypingUsers, setOnlineCount])
}
