import { useTheme } from '../context/ThemeContext'
import { themeClass, BTN_FUNCTION, BTN_AMBER_DARK } from '../utils/themeClasses'

type ActiveMode = 'calculator' | 'challenge' | '24game'

interface MobileModeBarProps {
  switchMode: (mode: ActiveMode) => void
}

export default function MobileModeBar({ switchMode }: MobileModeBarProps) {
  const { theme } = useTheme()

  const btnClass =
    themeClass(theme, BTN_FUNCTION) === BTN_FUNCTION.dark
      ? `glass-btn ${BTN_AMBER_DARK}`
      : `glass-btn ${themeClass(theme, BTN_FUNCTION)}`

  return (
    <div className="xl:hidden w-full flex items-center gap-1.5 mb-1">
      <button
        type="button"
        onClick={() => switchMode('24game')}
        className={`flex-1 h-9 rounded-full text-[11px] font-semibold ${btnClass}`}
      >
        🃏 24点
      </button>
      <button
        type="button"
        onClick={() => switchMode('challenge')}
        className={`flex-1 h-9 rounded-full text-[11px] font-semibold ${btnClass}`}
      >
        🏆 口算
      </button>
    </div>
  )
}
