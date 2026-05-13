import { useTheme } from '../context/ThemeContext'
import { useTranslation } from '../context/LanguageContext'
import LanguageToggle from './LanguageToggle'
import ThemeToggle from './ThemeToggle'
import { themeClass, HEADER_BG, HEADER_TEXT } from '../utils/themeClasses'

export default function AppHeader() {
  const { theme } = useTheme()
  const { t } = useTranslation()

  return (
    <header
      className={`relative z-20 px-8 py-4 h-16 flex items-center justify-between overflow-visible ${themeClass(theme, HEADER_BG)}`}
    >
      <div className="flex items-center gap-3">
        <span className="text-2xl drop-shadow-lg">🧮</span>
        <span
          className={`text-xl font-bold tracking-tight font-display ${themeClass(theme, HEADER_TEXT)}`}
        >
          {t('app.title')}
        </span>
      </div>
      <div className="flex items-center gap-2 pr-1">
        <LanguageToggle />
        <ThemeToggle />
      </div>
    </header>
  )
}
