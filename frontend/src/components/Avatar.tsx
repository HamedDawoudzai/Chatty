interface AvatarProps {
  name: string
  src?: string | null
  size?: 'sm' | 'md' | 'lg'
  onClick?: () => void
}

const sizes = { sm: 'w-6 h-6 text-xs', md: 'w-8 h-8 text-sm', lg: 'w-16 h-16 text-xl' }

export function Avatar({ name, src, size = 'md', onClick }: AvatarProps) {
  const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
  return (
    <div onClick={onClick} className={`${sizes[size]} rounded-full flex-shrink-0 overflow-hidden cursor-${onClick ? 'pointer' : 'default'}`}>
      {src
        ? <img src={src} alt={name} className="w-full h-full object-cover" />
        : <div className={`${sizes[size]} rounded-full bg-brand-500 flex items-center justify-center text-white font-semibold`}>{initials}</div>
      }
    </div>
  )
}
