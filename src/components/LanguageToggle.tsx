import { useState, useRef, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation, langOrder, langLabel } from '../context/LanguageContext'

export default function LanguageToggle() {
  const { lang, setLang } = useTranslation()
  const [open, setOpen] = useState(false)
  const [pos, setPos] = useState({ top: 0, left: 0 })
  const btnRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  const close = useCallback(() => setOpen(false), [])

  // Reposition dropdown on open / scroll / resize
  useEffect(() => {
    if (!open) return
    const update = () => {
      if (btnRef.current) {
        const rect = btnRef.current.getBoundingClientRect()
        setPos({ top: rect.bottom + 6, left: rect.right })
      }
    }
    update()
    window.addEventListener('scroll', update, true)
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update, true)
      window.removeEventListener('resize', update)
    }
  }, [open])

  // Outside-click close (capture phase so it fires first)
  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) close()
    }
    // Delay listener so the button click that opened it isn't immediately caught
    const t = setTimeout(() => document.addEventListener('mousedown', handler, true), 0)
    return () => {
      clearTimeout(t)
      document.removeEventListener('mousedown', handler, true)
    }
  }, [open, close])

  const toggle = () => setOpen(v => !v)

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        onClick={toggle}
        className={`
          relative h-8 px-3 rounded-full
          transition-all duration-300
          flex items-center justify-center gap-1.5
          backdrop-blur-md cursor-pointer
          text-[11px] font-semibold tracking-wider
          whitespace-nowrap
          ${lang === 'en'
            ? 'bg-white/50 border border-white/60 text-gray-700 hover:shadow-md'
            : 'bg-white/5 border border-white/10 text-gray-300 hover:shadow-md'
          }
        `}
        aria-label="切换语言"
      >
        <span className="text-xs leading-none">🌐</span>
        <span>{langLabel[lang]}</span>
        <span className={`text-[8px] transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>▼</span>
      </button>

      {open && createPortal(
        <div
          ref={menuRef}
          role="menu"
          className={`
            fixed py-1 min-w-[120px]
            rounded-xl overflow-hidden
            backdrop-blur-xl
            ${lang === 'en'
              ? 'bg-white/70 border border-white/60 shadow-lg shadow-black/5'
              : 'bg-gray-800/80 border border-white/10 shadow-lg shadow-black/20'
            }
          `}
          style={{ top: pos.top, left: pos.left - 120 }}
        >
          {langOrder.map((l) => (
            <button
              key={l}
              type="button"
              role="menuitem"
              onClick={() => { setLang(l); setOpen(false) }}
              className={`
                w-full text-left px-3.5 py-2 text-xs font-medium
                transition-colors duration-150
                flex items-center gap-2
                ${l === lang
                  ? (lang === 'en'
                    ? 'bg-purple-100/70 text-purple-700'
                    : 'bg-purple-500/15 text-purple-300')
                  : (lang === 'en'
                    ? 'text-gray-600 hover:bg-black/5'
                    : 'text-gray-300 hover:bg-white/5')
                }
              `}
            >
              <span className="w-5 text-center">
                {l === 'en' ? '🇺🇸' : l === 'zh' ? '🇨🇳' : l === 'ja' ? '🇯🇵' : l === 'ko' ? '🇰🇷' : '🇫🇷'}
              </span>
              <span>{langLabel[l]}</span>
              {l === lang && <span className="ml-auto text-[10px]">✓</span>}
            </button>
          ))}
        </div>,
        document.body
      )}
    </>
  )
}
