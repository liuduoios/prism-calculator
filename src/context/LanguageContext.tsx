import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

type Lang = 'en' | 'zh' | 'ja' | 'ko' | 'fr'

interface LanguageContextType {
  lang: Lang
  setLang: (lang: Lang) => void
  t: (key: string) => string
}

const translations: Record<string, Record<Lang, string>> = {
  'app.title': {
    en: 'Prism Calculator',
    zh: '浮光计算器',
    ja: 'プリズム電卓',
    ko: '프리즘 계산기',
    fr: 'Calculatrice Prism',
  },
  'app.footer': {
    en: 'Glassmorphism Design',
    zh: 'Glassmorphism 设计',
    ja: 'Glassmorphism デザイン',
    ko: 'Glassmorphism 디자인',
    fr: 'Design Glassmorphism',
  },
  'history.empty': {
    en: 'No history',
    zh: '暂无计算历史',
    ja: '履歴なし',
    ko: '계산 기록 없음',
    fr: 'Aucun historique',
  },
  'history.title': {
    en: 'History',
    zh: '计算历史',
    ja: '計算履歴',
    ko: '계산 기록',
    fr: 'Historique',
  },
  'history.clear': {
    en: 'Clear',
    zh: '清空',
    ja: 'クリア',
    ko: '비우기',
    fr: 'Effacer',
  },
  'sci.expand': {
    en: 'Scientific',
    zh: '展开科学计算',
    ja: '科学計算',
    ko: '과학 계산',
    fr: 'Scientifique',
  },
  'sci.collapse': {
    en: 'Hide Scientific',
    zh: '收起科学计算',
    ja: '科学計算を隠す',
    ko: '과학 계산 숨기기',
    fr: 'Masquer scientifique',
  },
  'memory.add': {
    en: 'M+',
    zh: 'M+',
    ja: 'M+',
    ko: 'M+',
    fr: 'M+',
  },
  'memory.subtract': {
    en: 'M−',
    zh: 'M−',
    ja: 'M−',
    ko: 'M−',
    fr: 'M−',
  },
  'memory.recall': {
    en: 'MR',
    zh: 'MR',
    ja: 'MR',
    ko: 'MR',
    fr: 'MR',
  },
  'memory.clear': {
    en: 'MC',
    zh: 'MC',
    ja: 'MC',
    ko: 'MC',
    fr: 'MC',
  },
}

const langOrder: Lang[] = ['en', 'zh', 'ja', 'ko', 'fr']

const langLabel: Record<Lang, string> = {
  en: 'EN',
  zh: '中文',
  ja: '日本語',
  ko: '한국어',
  fr: 'FR',
}

export { langOrder, langLabel }

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

function getInitialLang(): Lang {
  const stored = localStorage.getItem('calculator-lang')
  if (langOrder.includes(stored as Lang)) return stored as Lang
  return 'en'
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
