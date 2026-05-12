import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

type Lang = 'zh' | 'en'

interface LanguageContextType {
  lang: Lang
  setLang: (lang: Lang) => void
  t: (key: string) => string
}

const translations: Record<string, Record<Lang, string>> = {
  'app.title': {
    zh: '精美计算器',
    en: 'Glass Calculator',
  },
  'app.footer': {
    zh: 'Glassmorphism 设计',
    en: 'Glassmorphism Design',
  },
  'history.empty': {
    zh: '暂无计算历史',
    en: 'No calculation history',
  },
  'history.title': {
    zh: '计算历史',
    en: 'History',
  },
  'history.clear': {
    zh: '清空',
    en: 'Clear',
  },
  'sci.expand': {
    zh: '展开科学计算',
    en: 'Scientific',
  },
  'sci.collapse': {
    zh: '收起科学计算',
    en: 'Hide Scientific',
  },
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

function getInitialLang(): Lang {
  const stored = localStorage.getItem('calculator-lang')
  if (stored === 'zh' || stored === 'en') return stored
  return navigator.language.startsWith('zh') ? 'zh' : 'en'
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(getInitialLang)

  const setLang = (l: Lang) => {
    setLangState(l)
    localStorage.setItem('calculator-lang', l)
  }

  const t = (key: string): string => translations[key]?.[lang] ?? key

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useTranslation(): LanguageContextType {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useTranslation must be used within LanguageProvider')
  return ctx
}
