import { useTheme } from '../context/ThemeContext'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  return (
    <button onClick={toggleTheme} className="btn-ghost px-2 text-base" title="Toggle dark mode">
      {theme === 'dark' ? '☀️' : '🌙'}
    </button>
  )
}
