import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

export type Theme = 'light' | 'dark' | 'neon' | 'retro'

interface ThemeContextType {
  theme: Theme
  setTheme: (t: Theme) => void
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

const THEME_LIST: Theme[] = ['light', 'dark', 'neon', 'retro']

function getInitialTheme(): Theme {
  const stored = localStorage.getItem('calculator-theme')
  if (THEME_LIST.includes(stored as Theme)) return stored as Theme
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme)

  const setTheme = (t: Theme) => {
    setThemeState(t)
    localStorage.setItem('calculator-theme', t)
  }

  useEffect(() => {
    const root = document.documentElement
    // Remove all theme classes
    THEME_LIST.forEach(t => root.classList.remove(t))
    root.classList.add(theme)
  }, [theme])

  const toggleTheme = () => {
    setThemeState(prev => {
      const idx = THEME_LIST.indexOf(prev)
      const next = THEME_LIST[(idx + 1) % THEME_LIST.length]
      localStorage.setItem('calculator-theme', next)
      return next
    })
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme(): ThemeContextType {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
