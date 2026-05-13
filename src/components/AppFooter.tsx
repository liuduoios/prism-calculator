import { useTheme } from '../context/ThemeContext'
import { useTranslation } from '../context/LanguageContext'
import { themeClass, FOOTER_TEXT } from '../utils/themeClasses'

export default function AppFooter() {
  const { theme } = useTheme()
  const { t } = useTranslation()

  return (
    <footer
      className={`relative z-10 pt-4 pb-6 px-8 text-center text-xs font-medium tracking-wide ${themeClass(theme, FOOTER_TEXT)}`}
    >
      <p>
        &copy; {new Date().getFullYear()} {t('app.title')} &mdash; {t('app.footer')}
      </p>
    </footer>
  )
}
