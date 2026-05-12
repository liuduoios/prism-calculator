import { useTheme } from '../context/ThemeContext'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const isLight = theme === 'light'

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`
        relative w-18 h-9 rounded-full
        transition-all duration-500 ease-out
        flex items-center px-1.5
        backdrop-blur-md
        ${isLight
          ? 'bg-white/50 border border-white/60 shadow-sm hover:shadow-md'
          : 'bg-white/5 border border-white/10 shadow-sm hover:shadow-md'
        }
      `}
      aria-label="切换主题"
    >
      {/* Track icons */}
      <span className={`
        absolute left-2 text-xs transition-all duration-300
        ${isLight ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}
      `}>☀️</span>
      <span className={`
        absolute right-2 text-xs transition-all duration-300
        ${isLight ? 'opacity-0 scale-50' : 'opacity-100 scale-100'}
      `}>🌙</span>

      {/* Thumb */}
      <span className={`
        relative w-6 h-6 rounded-full
        shadow-md
        transform transition-all duration-500 ease-out
        ${isLight
          ? 'translate-x-0 bg-gradient-to-br from-amber-300 to-amber-400'
          : 'translate-x-9 bg-gradient-to-br from-indigo-400 to-purple-500'
        }
      `}>
        {/* Inner glow */}
        <span className={`
          absolute inset-1 rounded-full
          transition-opacity duration-300
          ${isLight ? 'bg-white/40' : 'bg-white/20'}
        `} />
      </span>
    </button>
  )
}
