import { useTheme } from '../context/ThemeContext'
import { useTranslation } from '../context/LanguageContext'
import { themeClass, GLASS_CARD, GLASS_CARD_SHADOW, BTN_FUNCTION, BTN_AMBER_DARK, SIDEBAR_LABEL_TEXT } from '../utils/themeClasses'

type ActiveMode = 'calculator' | 'challenge' | '24game'

interface ModeSidebarProps {
  switchMode: (mode: ActiveMode) => void
}

export default function ModeSidebar({ switchMode }: ModeSidebarProps) {
  const { theme } = useTheme()
  const { t } = useTranslation()

  const btnClass =
    themeClass(theme, BTN_FUNCTION) === BTN_FUNCTION.dark
      ? `glass-btn ${BTN_AMBER_DARK}`
      : `glass-btn ${themeClass(theme, BTN_FUNCTION)}`

  return (
    <div
      className={`
        hidden xl:flex flex-col gap-3 w-56 p-5
        glass-card
        ${themeClass(theme, GLASS_CARD)}
        ${themeClass(theme, GLASS_CARD_SHADOW)}
      `}
    >
      <div className={`text-xs font-semibold tracking-wider opacity-40 uppercase mb-1 text-center ${themeClass(theme, SIDEBAR_LABEL_TEXT)}`}>
        {t('game.mode') || '游戏模式'}
      </div>

      <button
        type="button"
        onClick={() => switchMode('24game')}
        className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-full text-sm font-semibold tracking-wider transition-all duration-300 ${btnClass}`}
      >
        <span>🃏</span>
        <span>24点游戏</span>
      </button>

      <button
        type="button"
        onClick={() => switchMode('challenge')}
        className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-full text-sm font-semibold tracking-wider transition-all duration-300 ${btnClass}`}
      >
        <span>🏆</span>
        <span>口算挑战</span>
      </button>

      <div className={`text-xs font-semibold tracking-wider opacity-40 uppercase mb-1 mt-2 text-center ${themeClass(theme, SIDEBAR_LABEL_TEXT)}`}>
        工具
      </div>
    </div>
  )
}
