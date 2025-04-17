import { useEffect, useState } from 'react'
import { getUser } from '../lib/api/users'
import { Avatar } from './Avatar'
import type { User } from '../lib/api/users'

interface UserProfilePopoverProps { userId: string; onClose: () => void }

export function UserProfilePopover({ userId, onClose }: UserProfilePopoverProps) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => { getUser(userId).then(setUser) }, [userId])

  if (!user) return null

  return (
    <div className="fixed inset-0 z-50" onClick={onClose}>
      <div onClick={e => e.stopPropagation()}
        className="absolute bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-xl w-56">
        <Avatar name={user.display_name ?? user.username} src={user.avatar_url} size="lg" />
        <p className="font-semibold mt-2">{user.display_name ?? user.username}</p>
        <p className="text-sm text-gray-400">@{user.username}</p>
        {user.bio && <p className="text-sm mt-2 text-gray-600 dark:text-gray-400">{user.bio}</p>}
      </div>
    </div>
  )
}
