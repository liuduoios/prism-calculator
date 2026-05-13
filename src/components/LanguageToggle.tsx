import { useState, useRef, useEffect, useCallback } from 'react'
import { useTranslation, langOrder, langLabel } from '../context/LanguageContext'
import { useTheme } from '../context/ThemeContext'
import { themeClass, HEADER_TEXT } from '../utils/themeClasses'

export default function LanguageToggle() {
  const { lang, setLang } = useTranslation()
  const { theme } = useTheme()
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const close = useCallback(() => setOpen(false), [])

  // Close on outside click via native mousedown capture
  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        close()
      }
    }
    // delay to avoid closing on the very click that opened it
    const t = setTimeout(() => document.addEventListener('mousedown', handler, true), 0)
    return () => {
      clearTimeout(t)
      document.removeEventListener('mousedown', handler, true)
    }
  }, [open, close])

  const handleSelect = (l: typeof lang) => {
    setLang(l)
    setOpen(false)
  }

  const isDarkBg = theme === 'dark' || theme === 'neon'

  const btnClass = isDarkBg
    ? 'bg-white/5 border border-white/10 text-gray-300 hover:shadow-md'
    : 'bg-white/50 border border-white/60 text-gray-700 hover:shadow-md'

  const dropdownClass = isDarkBg
    ? 'bg-gray-800/80 border border-white/10 shadow-xl shadow-black/20'
    : 'bg-white/80 border border-white/60 shadow-xl shadow-black/5'

  const itemActiveClass = isDarkBg ? 'bg-purple-500/20 text-purple-300' : 'bg-purple-100/80 text-purple-700'
  const itemInactiveClass = isDarkBg ? 'text-gray-300 hover:bg-white/5' : 'text-gray-600 hover:bg-black/5'

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className={`
          relative h-8 px-3 rounded-full
          transition-all duration-300
          flex items-center justify-center gap-1.5
          backdrop-blur-md cursor-pointer
          text-[11px] font-semibold tracking-wider
          whitespace-nowrap
          ${btnClass}
        `}
        aria-label="切换语言"
      >
        <span className="text-xs leading-none">🌐</span>
        <span>{langLabel[lang]}</span>
        <span className={`text-[8px] transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>▼</span>
      </button>

      {open && (
        <div
          className={`
            absolute right-0 top-full mt-1.5 py-1 min-w-[120px]
            rounded-xl overflow-hidden z-[9999]
            backdrop-blur-xl
            ${dropdownClass}
          `}
        >
          {langOrder.map((l) => (
            <button
              key={l}
              type="button"
              onMouseDown={(e) => {
                // Use native event to bypass any React synthetic event issues
                e.preventDefault()
                e.stopPropagation()
                handleSelect(l)
              }}
              className={`
                w-full text-left px-3.5 py-2 text-xs font-medium
                transition-colors duration-150
                flex items-center gap-2
                ${l === lang ? itemActiveClass : itemInactiveClass}
              `}
            >
              <span className="w-5 text-center">
                {l === 'en' ? '🇺🇸' : l === 'zh' ? '🇨🇳' : l === 'ja' ? '🇯🇵' : l === 'ko' ? '🇰🇷' : '🇫🇷'}
              </span>
              <span>{langLabel[l]}</span>
              {l === lang && <span className="ml-auto text-[10px]">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
