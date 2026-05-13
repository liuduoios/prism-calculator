import type { ReactNode } from 'react'
import { useTheme } from '../context/ThemeContext'
import { themeClass, GLASS_CARD, GLASS_CARD_SHADOW } from '../utils/themeClasses'

interface ModeWrapperProps {
  onBack: () => void
  children: ReactNode
}

/**
 * Shared glass-card container for Challenge & 24-Game modes.
 * Provides the back button and consistent card styling.
 */
export default function ModeWrapper({ onBack, children }: ModeWrapperProps) {
  const { theme } = useTheme()

  return (
    <div
      className={`
        w-full max-w-[520px] p-6
        glass-card
        ${themeClass(theme, GLASS_CARD)}
        ${themeClass(theme, GLASS_CARD_SHADOW)}
      `}
    >
      <button
        type="button"
        onClick={onBack}
        className="mb-4 text-sm font-medium opacity-50 hover:opacity-100 transition-opacity flex items-center gap-1"
      >
        <span>←</span> 返回计算器
      </button>
      {children}
    </div>
  )
}
