interface TypingIndicatorProps { users: string[] }

export function TypingIndicator({ users }: TypingIndicatorProps) {
  if (!users.length) return null
  const text = users.length === 1
    ? `${users[0]} is typing…`
    : users.length === 2
    ? `${users[0]} and ${users[1]} are typing…`
    : 'Several people are typing…'
  return (
    <div className="px-4 pb-1 flex items-center gap-2 text-xs text-gray-400">
      <span className="flex gap-0.5">
        {[0, 1, 2].map(i => (
          <span key={i} className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
            style={{ animationDelay: `${i * 150}ms` }} />
        ))}
      </span>
      {text}
    </div>
  )
}
