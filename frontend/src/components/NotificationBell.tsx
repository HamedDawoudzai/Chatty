import { useEffect, useState } from 'react'
import { getNotifications, markAllRead } from '../lib/api/notifications'
import type { Notification } from '../lib/api/notifications'

export function NotificationBell() {
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])

  useEffect(() => { getNotifications().then(setNotifications) }, [])

  const unread = notifications.filter(n => !n.is_read).length

  const handleOpen = async () => {
    setOpen(v => !v)
    if (!open && unread) {
      await markAllRead()
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
    }
  }

  return (
    <div className="relative">
      <button onClick={handleOpen} className="relative btn-ghost px-2">
        🔔
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
            {unread}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 w-72 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-20 overflow-hidden">
          <div className="p-3 border-b border-gray-200 dark:border-gray-700 font-semibold text-sm">Notifications</div>
          {notifications.length === 0
            ? <p className="p-4 text-sm text-gray-400">No notifications</p>
            : notifications.slice(0, 10).map(n => (
              <div key={n.id} className={`p-3 border-b border-gray-100 dark:border-gray-700 text-sm ${!n.is_read ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}>
                <p className="font-medium">{n.title}</p>
                {n.body && <p className="text-gray-500 text-xs mt-0.5">{n.body}</p>}
              </div>
            ))
          }
        </div>
      )}
    </div>
  )
}
