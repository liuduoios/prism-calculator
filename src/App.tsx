import { useReducer, useCallback, useState, useEffect } from 'react'
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
import TwentyFourGame from './components/TwentyFourGame'
import { Analytics } from './utils/analytics'

type ActiveMode = 'calculator' | 'challenge' | '24game'

function CalculatorContent() {
  const { theme } = useTheme()
  const { t, lang } = useTranslation()
  const [state, dispatchRaw] = useReducer(calculatorReducer, initialState)
  const { playSound, vibrate } = useSoundFeedback()
  const [activeMode, switchModeRaw] = useState<ActiveMode>('calculator')

  const switchMode = useCallback((mode: ActiveMode) => {
    switchModeRaw(mode)
    if (mode !== 'calculator') {
      Analytics.gameModeEnter(mode)
    }
  }, [])

  // Track theme changes
  useEffect(() => {
    Analytics.themeChange(theme)
  }, [theme])

  // Track language changes
  useEffect(() => {
    Analytics.languageChange(lang)
  }, [lang])

  // Wrap dispatch with sound + haptic feedback + analytics
  const dispatch = useCallback((action: CalculatorAction) => {
    playSound(action)
    vibrate(action)

    // Track key calculator actions
    if (action.type === 'INPUT_DIGIT') Analytics.buttonClick(action.digit)
    else if (action.type === 'INPUT_OPERATOR') Analytics.buttonClick(action.operator)
    else if (action.type === 'EVALUATE') {
      Analytics.calculation(state.expression, state.displayValue)
    }
    else if (action.type === 'CLEAR') Analytics.buttonClick('C')
    else if (action.type === 'SCIENTIFIC') Analytics.buttonClick(action.func)

    dispatchRaw(action)
  }, [playSound, vibrate, state.expression, state.displayValue])

  useKeyboard(dispatch)

  const gameBtnClass = theme === 'neon'
    ? 'glass-btn glass-btn-function-neon'
    : theme === 'retro'
      ? 'glass-btn glass-btn-function-retro'
      : theme === 'dark'
        ? 'glass-btn amber-btn-dark'
        : 'glass-btn glass-btn-function-light'

  const gameMobileBtnClass = theme === 'neon'
    ? 'glass-btn glass-btn-function-neon'
    : theme === 'retro'
      ? 'glass-btn glass-btn-function-retro'
      : theme === 'dark'
        ? 'glass-btn amber-btn-dark'
        : 'glass-btn glass-btn-function-light'

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

      {/* Main — layout switches based on activeMode */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 md:p-6">

        {/* ═══ CHALLENGE MODE — full screen ═══ */}
        {activeMode === 'challenge' && (
          <div className={`
            w-full max-w-[520px] p-6
            glass-card
            ${theme === 'neon' ? 'glass-card-neon' : theme === 'retro' ? 'glass-card-retro' : theme === 'light' ? 'glass-card-light' : 'glass-card-dark'}
            ${theme === 'neon' ? 'shadow-[0_0_30px_rgba(6,182,212,0.3)]' : 'hover:shadow-[0_12px_40px_rgba(0,0,0,0.12)]'}
          `}>
            <button
              type="button"
              onClick={() => switchMode('calculator')}
              className="mb-4 text-sm font-medium opacity-50 hover:opacity-100 transition-opacity flex items-center gap-1"
            >
              <span>←</span> 返回计算器
            </button>
            <ChallengeMode onBack={() => switchMode('calculator')} />
          </div>
        )}

        {/* ═══ 24 GAME MODE — full screen ═══ */}
        {activeMode === '24game' && (
          <div className={`
            w-full max-w-[520px] p-6
            glass-card
            ${theme === 'neon' ? 'glass-card-neon' : theme === 'retro' ? 'glass-card-retro' : theme === 'light' ? 'glass-card-light' : 'glass-card-dark'}
            ${theme === 'neon' ? 'shadow-[0_0_30px_rgba(6,182,212,0.3)]' : 'hover:shadow-[0_12px_40px_rgba(0,0,0,0.12)]'}
          `}>
            <button
              type="button"
              onClick={() => switchMode('calculator')}
              className="mb-4 text-sm font-medium opacity-50 hover:opacity-100 transition-opacity flex items-center gap-1"
            >
              <span>←</span> 返回计算器
            </button>
            <TwentyFourGame onBack={() => switchMode('calculator')} />
          </div>
        )}

        {/* ═══ DEFAULT: Calculator Mode — three-column layout ═══ */}
        {activeMode === 'calculator' && (
          <div className="flex flex-col xl:flex-row gap-5 w-full max-w-[1200px] justify-center items-stretch">

            {/* Column 1: Mode Toolbar — desktop sidebar */}
            <div className={`
              hidden xl:flex flex-col gap-3 w-56 p-5
              glass-card
              ${theme === 'neon' ? 'glass-card-neon' : theme === 'retro' ? 'glass-card-retro' : theme === 'light' ? 'glass-card-light' : 'glass-card-dark'}
              ${theme === 'neon' ? 'shadow-[0_0_30px_rgba(6,182,212,0.3)]' : 'hover:shadow-[0_12px_40px_rgba(0,0,0,0.12)]'}
            `}>
              <div className="text-xs font-semibold tracking-wider opacity-40 uppercase mb-1 text-center">{t('game.mode') || '游戏模式'}</div>
              <button
                type="button"
                onClick={() => switchMode('24game')}
                className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-full text-sm font-semibold tracking-wider transition-all duration-300 ${gameBtnClass}`}
              >
                <span>🃏</span><span>24点游戏</span>
              </button>
              <button
                type="button"
                onClick={() => switchMode('challenge')}
                className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-full text-sm font-semibold tracking-wider transition-all duration-300 ${gameBtnClass}`}
              >
                <span>🏆</span><span>口算挑战</span>
              </button>
              <div className="text-xs font-semibold tracking-wider opacity-40 uppercase mb-1 mt-2 text-center">工具</div>
            </div>

            {/* Mobile: compact mode toggles — tiny row ABOVE calculator */}
            <div className="xl:hidden w-full flex items-center gap-1.5 mb-1">
              <button type="button" onClick={() => switchMode('24game')} className={`flex-1 h-9 rounded-full text-[11px] font-semibold ${gameMobileBtnClass}`}>🃏 24点</button>
              <button type="button" onClick={() => switchMode('challenge')} className={`flex-1 h-9 rounded-full text-[11px] font-semibold ${gameMobileBtnClass}`}>🏆 口算</button>
            </div>

            {/* Calculator + History row (stacks on mobile) */}
            <div className="flex gap-5 w-full max-w-[740px] items-stretch">
              <div className={`
                flex-1 min-w-0 flex flex-col p-6
                glass-card
                ${theme === 'neon' ? 'glass-card-neon' : theme === 'retro' ? 'glass-card-retro' : theme === 'light' ? 'glass-card-light' : 'glass-card-dark'}
                ${theme === 'neon' ? 'shadow-[0_0_30px_rgba(6,182,212,0.3)]' : 'hover:shadow-[0_12px_40px_rgba(0,0,0,0.12)]'}
              `}>
                <Display displayValue={state.displayValue} expression={state.expression} />
                <ProgrammerMode displayValue={state.displayValue} dispatch={dispatch} />
                <Keypad dispatch={dispatch} />
              </div>
              <div className={`
                hidden xl:flex flex-col w-72 p-6
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
          </div>
        )}
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
