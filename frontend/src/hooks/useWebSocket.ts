import { useEffect, useRef, useCallback, useState } from 'react'
import { WS_EVENTS } from '../lib/wsEvents'

export function useWebSocket(roomId: string, token: string | null) {
  const wsRef = useRef<WebSocket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const handlersRef = useRef<Map<string, ((data: any) => void)[]>>(new Map())

  const connect = useCallback(() => {
    if (!token || !roomId) return
    const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws'
    const ws = new WebSocket(`${protocol}://${window.location.host}/api/v1/ws/${roomId}?token=${token}`)
    wsRef.current = ws
    ws.onopen = () => setIsConnected(true)
    ws.onclose = () => {
      setIsConnected(false)
      setTimeout(connect, 3000)
    }
    ws.onerror = () => ws.close()
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      const handlers = handlersRef.current.get(data.type) ?? []
      handlers.forEach(h => h(data))
    }
  }, [roomId, token])

  useEffect(() => {
    connect()
    return () => { wsRef.current?.close() }
  }, [connect])

  const send = useCallback((type: string, payload: object = {}) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type, payload }))
    }
  }, [])

  const on = useCallback((type: string, handler: (data: any) => void) => {
    const list = handlersRef.current.get(type) ?? []
    handlersRef.current.set(type, [...list, handler])
    return () => {
      handlersRef.current.set(type, (handlersRef.current.get(type) ?? []).filter(h => h !== handler))
    }
  }, [])

  return { send, on, isConnected }
}
