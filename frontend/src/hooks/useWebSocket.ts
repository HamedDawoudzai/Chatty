import { useEffect, useRef, useCallback, useState } from 'react'

export function useWebSocket(roomId: string, token: string | null) {
  const wsRef = useRef<WebSocket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const handlersRef = useRef<Map<string, Set<(data: any) => void>>>(new Map())
  const seenIds = useRef<Set<string>>(new Set())
  const reconnectTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const unmounted = useRef(false)

  const connect = useCallback(() => {
    if (!token || !roomId || unmounted.current) return
    const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws'
    const ws = new WebSocket(`${protocol}://${window.location.host}/api/v1/ws/${roomId}?token=${token}`)
    wsRef.current = ws

    ws.onopen = () => { if (!unmounted.current) setIsConnected(true) }
    ws.onclose = () => {
      if (unmounted.current) return
      setIsConnected(false)
      reconnectTimer.current = setTimeout(connect, 3000)
    }
    ws.onerror = () => ws.close()
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      if (data.message?.id) {
        if (seenIds.current.has(data.message.id)) return
        seenIds.current.add(data.message.id)
      }
      const handlers = handlersRef.current.get(data.type)
      handlers?.forEach(h => h(data))
    }
  }, [roomId, token])

  useEffect(() => {
    unmounted.current = false
    seenIds.current.clear()
    connect()
    return () => {
      unmounted.current = true
      if (reconnectTimer.current) clearTimeout(reconnectTimer.current)
      wsRef.current?.close()
    }
  }, [connect])

  const send = useCallback((type: string, payload: object = {}) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type, payload }))
    }
  }, [])

  const on = useCallback((type: string, handler: (data: any) => void) => {
    if (!handlersRef.current.has(type)) handlersRef.current.set(type, new Set())
    handlersRef.current.get(type)!.add(handler)
    return () => { handlersRef.current.get(type)?.delete(handler) }
  }, [])

  return { send, on, isConnected }
}
