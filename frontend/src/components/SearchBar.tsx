import { useState, useCallback } from 'react'

interface SearchBarProps { onSearch: (q: string) => void }

export function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
    onSearch(e.target.value)
  }, [onSearch])

  if (!open) return (
    <button onClick={() => setOpen(true)} className="btn-ghost px-2" title="Search messages">🔍</button>
  )

  return (
    <div className="flex items-center gap-1">
      <input autoFocus className="input text-sm py-1 w-40" placeholder="Search…"
        value={query} onChange={handleChange} />
      <button onClick={() => { setOpen(false); setQuery(''); onSearch('') }}
        className="text-gray-400 hover:text-gray-600">✕</button>
    </div>
  )
}
