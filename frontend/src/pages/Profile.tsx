import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { updateMe, uploadAvatar } from '../lib/api/users'
import { Avatar } from '../components/Avatar'

export default function Profile() {
  const { user, refreshUser } = useAuth()
  const [displayName, setDisplayName] = useState(user?.display_name ?? '')
  const [bio, setBio] = useState(user?.bio ?? '')
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    await updateMe({ display_name: displayName, bio })
    await refreshUser()
    setSuccess(true)
    setSaving(false)
    setTimeout(() => setSuccess(false), 3000)
  }

  const handleAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    await uploadAvatar(file)
    await refreshUser()
  }

  if (!user) return null

  return (
    <div className="max-w-lg mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Profile</h1>
      <div className="flex items-center gap-4">
        <div className="relative">
          <Avatar name={user.display_name ?? user.username} src={user.avatar_url} size="lg" />
          <label className="absolute bottom-0 right-0 bg-brand-500 text-white rounded-full w-6 h-6 flex items-center justify-center cursor-pointer text-xs">
            +<input type="file" accept="image/*" className="hidden" onChange={handleAvatar} />
          </label>
        </div>
        <div>
          <p className="font-semibold text-lg">{user.username}</p>
          <p className="text-gray-500 text-sm">{user.email}</p>
        </div>
      </div>
      <form onSubmit={handleSave} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Display Name</label>
          <input className="input" value={displayName} onChange={e => setDisplayName(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Bio</label>
          <textarea className="input resize-none" rows={3} value={bio} onChange={e => setBio(e.target.value)} />
        </div>
        {success && <p className="text-green-500 text-sm">Profile saved!</p>}
        <button type="submit" disabled={saving} className="btn-primary">
          {saving ? 'Saving…' : 'Save changes'}
        </button>
      </form>
    </div>
  )
}
