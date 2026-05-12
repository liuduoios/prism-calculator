import { useTheme } from '../context/ThemeContext'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className={`
        relative w-16 h-8 rounded-full transition-all duration-300
        flex items-center px-1 shadow-inner
        ${theme === 'light'
          ? 'bg-amber-200 border border-amber-300'
          : 'bg-gray-700 border border-gray-600'
        }
      `}
      aria-label="切换主题"
    >
      {/* Track icons */}
      <span className={`
        absolute left-2 text-xs transition-opacity duration-300
        ${theme === 'light' ? 'opacity-100' : 'opacity-0'}
      `}>☀️</span>
      <span className={`
        absolute right-2 text-xs transition-opacity duration-300
        ${theme === 'dark' ? 'opacity-100' : 'opacity-0'}
      `}>🌙</span>

      {/* Thumb */}
      <span className={`
        relative w-6 h-6 rounded-full shadow-md
        transform transition-transform duration-300
        ${theme === 'light'
          ? 'translate-x-0 bg-white'
          : 'translate-x-8 bg-gray-400'
        }
      `} />
    </button>
  )
}
