import { useReducer } from 'react'
import { ThemeProvider, useTheme } from './context/ThemeContext'
import { LanguageProvider, useTranslation } from './context/LanguageContext'
import { calculatorReducer, initialState } from './reducer/calculatorReducer'
import { useKeyboard } from './hooks/useKeyboard'
import Display from './components/Display'
import Keypad from './components/Keypad'
import History from './components/History'
import ThemeToggle from './components/ThemeToggle'
import LanguageToggle from './components/LanguageToggle'
function CalculatorContent() {
  const { theme } = useTheme()
  const { t } = useTranslation()
  const [state, dispatch] = useReducer(calculatorReducer, initialState)
  useKeyboard(dispatch)

  const isLight = theme === 'light'

  return (
    <div className={`min-h-screen flex flex-col transition-all duration-500 relative overflow-hidden
      ${isLight
        ? 'bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50'
        : 'bg-gradient-to-br from-gray-950 via-slate-900 to-gray-900'
      }`}
    >

      {/* Floating background orbs */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />
      <div className="orb orb-4" />

      {/* Header */}
      <header className={`relative z-20 px-6 py-4 h-16 flex items-center justify-between overflow-visible
        ${isLight
          ? 'bg-white/40 backdrop-blur-md border-b border-white/40'
          : 'bg-gray-900/40 backdrop-blur-md border-b border-white/5'
        }`}
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl drop-shadow-lg">🧮</span>
          <span className={`text-xl font-bold tracking-tight font-display
            ${isLight ? 'text-gray-800' : 'text-white'}
          `}>
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
            ${isLight ? 'glass-card-light' : 'glass-card-dark'}
            hover:shadow-[0_12px_40px_rgba(0,0,0,0.12)]
          `}>
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
            ${isLight ? 'glass-card-light' : 'glass-card-dark'}
            hover:shadow-[0_12px_40px_rgba(0,0,0,0.12)]
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
      <footer className={`relative z-10 py-5 px-6 text-center text-xs font-medium tracking-wide
        ${isLight ? 'text-purple-300/70' : 'text-gray-600'}`}
      >
        <p>&copy; {new Date().getFullYear()} {t('app.title')} &mdash; {t('app.footer')}</p>
      </footer>
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
