import { useReducer, useCallback } from 'react'
import { ThemeProvider, useTheme } from './context/ThemeContext'
import { LanguageProvider, useTranslation } from './context/LanguageContext'
import { calculatorReducer, initialState } from './reducer/calculatorReducer'
import type { CalculatorAction } from './reducer/calculatorReducer'
import { useKeyboard } from './hooks/useKeyboard'
import { useSoundFeedback } from './hooks/useSoundFeedback'
import Display from './components/Display'
import Keypad from './components/Keypad'
import History from './components/History'
import ThemeToggle from './components/ThemeToggle'
import LanguageToggle from './components/LanguageToggle'
import EasterEgg from './components/EasterEgg'
import ProgrammerMode from './components/ProgrammerMode'
import ChallengeMode from './components/ChallengeMode'
function CalculatorContent() {
  const { theme } = useTheme()
  const { t } = useTranslation()
  const [state, dispatchRaw] = useReducer(calculatorReducer, initialState)
  const { playSound, vibrate } = useSoundFeedback()

  // Wrap dispatch with sound + haptic feedback
  const dispatch = useCallback((action: CalculatorAction) => {
    playSound(action)
    vibrate(action)
    dispatchRaw(action)
  }, [playSound, vibrate])

  useKeyboard(dispatch)

  const bgMap: Record<string, string> = {
    light: 'bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50',
    dark: 'bg-gradient-to-br from-gray-950 via-slate-900 to-gray-900',
    neon: 'bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950',
    retro: 'bg-gradient-to-br from-amber-50 via-emerald-50 to-teal-50',
  }

  const headerBgMap: Record<string, string> = {
    light: 'bg-white/40 backdrop-blur-md border-b border-white/40',
    dark: 'bg-gray-900/40 backdrop-blur-md border-b border-white/5',
    neon: 'bg-black/60 backdrop-blur-md border-b border-cyan-500/20',
    retro: 'bg-amber-100/60 backdrop-blur-md border-b border-amber-300/40',
  }

  const headerTextMap: Record<string, string> = {
    light: 'text-gray-800',
    dark: 'text-white',
    neon: 'text-cyan-300',
    retro: 'text-emerald-900',
  }

  const footerTextMap: Record<string, string> = {
    light: 'text-purple-300/70',
    dark: 'text-gray-600',
    neon: 'text-cyan-500/50',
    retro: 'text-emerald-600/60',
  }

  return (
    <div className={`min-h-screen flex flex-col transition-all duration-500 relative overflow-hidden ${bgMap[theme]}`}
    >

      {/* Floating background orbs — only for light/dark */}
      {(theme === 'light' || theme === 'dark') && (
        <>
          <div className="orb orb-1" />
          <div className="orb orb-2" />
          <div className="orb orb-3" />
          <div className="orb orb-4" />
        </>
      )}

      {/* Neon scanline effect */}
      {theme === 'neon' && (
        <div className="fixed inset-0 pointer-events-none z-[1] neon-scanlines" />
      )}

      {/* Retro grain overlay */}
      {theme === 'retro' && (
        <div className="fixed inset-0 pointer-events-none z-[1] retro-grain opacity-30" />
      )}

      {/* Header */}
      <header className={`relative z-20 px-8 py-4 h-16 flex items-center justify-between overflow-visible ${headerBgMap[theme]}`}
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl drop-shadow-lg">🧮</span>
          <span className={`text-xl font-bold tracking-tight font-display ${headerTextMap[theme]}`}>
            {t('app.title')}
          </span>
        </div>
        <div className="flex items-center gap-2 pr-1">
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </header>

      {/* Main */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 md:p-6">
        <div className="flex gap-5 w-full max-w-[960px] justify-center">
          {/* Calculator Card */}
          <div className={`
            w-full max-w-[420px] flex flex-col p-6
            glass-card
            ${theme === 'neon' ? 'glass-card-neon' : theme === 'retro' ? 'glass-card-retro' : theme === 'light' ? 'glass-card-light' : 'glass-card-dark'}
            ${theme === 'neon' ? 'shadow-[0_0_30px_rgba(6,182,212,0.3)]' : 'hover:shadow-[0_12px_40px_rgba(0,0,0,0.12)]'}
          `}>
            <ChallengeMode />
            <ProgrammerMode displayValue={state.displayValue} dispatch={dispatch} />
            <Display
              displayValue={state.displayValue}
              expression={state.expression}
            />
            <Keypad dispatch={dispatch} />
          </div>

          {/* History Panel */}
          <div className={`
            hidden lg:flex flex-col w-72 p-6
            glass-card
            ${theme === 'neon' ? 'glass-card-neon' : theme === 'retro' ? 'glass-card-retro' : theme === 'light' ? 'glass-card-light' : 'glass-card-dark'}
            ${theme === 'neon' ? 'shadow-[0_0_30px_rgba(6,182,212,0.3)]' : 'hover:shadow-[0_12px_40px_rgba(0,0,0,0.12)]'}
          `}>
            <History
              history={state.history}
              onSelect={(item) => dispatch({ type: 'SELECT_HISTORY', item })}
              onClear={() => dispatch({ type: 'CLEAR_HISTORY' })}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className={`relative z-10 pt-4 pb-6 px-8 text-center text-xs font-medium tracking-wide
        ${footerTextMap[theme]}`}
      >
        <p>&copy; {new Date().getFullYear()} {t('app.title')} &mdash; {t('app.footer')}</p>
      </footer>

      <EasterEgg displayValue={state.displayValue} />
    </div>
  )
}

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <CalculatorContent />
      </LanguageProvider>
    </ThemeProvider>
  )
}

export default App
