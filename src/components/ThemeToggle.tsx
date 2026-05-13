import { useTheme } from '../context/ThemeContext'
import type { Theme } from '../context/ThemeContext'
import { themeClass } from '../utils/themeClasses'

const THEME_META: Record<Theme, { icon: string; label: string; gradient: string }> = {
  light: { icon: '☀️', label: '亮色', gradient: 'from-amber-300 to-amber-400' },
  dark: { icon: '🌙', label: '暗色', gradient: 'from-indigo-400 to-purple-500' },
  neon: { icon: '🌆', label: '霓虹', gradient: 'from-cyan-400 via-fuchsia-400 to-amber-400' },
  retro: { icon: '📟', label: '复古', gradient: 'from-emerald-500 to-teal-600' },
}

const TOGGLE_CLASS: Record<Theme, string> = {
  light: 'bg-white/50 border border-white/60 text-gray-700 hover:shadow-md',
  dark: 'bg-white/5 border border-white/10 text-gray-300 hover:shadow-md',
  neon: 'bg-black/40 border border-cyan-400/40 text-cyan-300 hover:shadow-md hover:shadow-cyan-500/20',
  retro: 'bg-amber-900/30 border border-amber-500/30 text-amber-400 hover:shadow-md',
}

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const meta = THEME_META[theme]

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`
        relative h-9 px-3 rounded-full flex items-center gap-1.5
        transition-all duration-500 ease-out
        backdrop-blur-md cursor-pointer
        text-[11px] font-semibold tracking-wider whitespace-nowrap
        ${themeClass(theme, TOGGLE_CLASS)}
      `}
      aria-label="切换主题"
    >
      <span className="text-xs leading-none">{meta.icon}</span>
      <span>{meta.label}</span>

      {/* Thumb indicator */}
      <span className={`
        w-5 h-5 rounded-full shadow-md
        bg-gradient-to-br ${meta.gradient}
        flex items-center justify-center
      `}>
        <span className="w-2 h-2 rounded-full bg-white/40" />
      </span>
    </button>
  )
}
