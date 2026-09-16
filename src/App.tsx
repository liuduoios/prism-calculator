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
import EasterEgg from './components/EasterEgg'
import ProgrammerMode from './components/ProgrammerMode'
import ChallengeMode from './components/ChallengeMode'
import TwentyFourGame from './components/TwentyFourGame'
import BackgroundEffects from './components/BackgroundEffects'
import AppHeader from './components/AppHeader'
import AppFooter from './components/AppFooter'
import ModeWrapper from './components/ModeWrapper'
import ModeSidebar from './components/ModeSidebar'
import MobileModeBar from './components/MobileModeBar'
import {
  themeClass,
  BG_GRADIENT,
  GLASS_CARD,
  GLASS_CARD_SHADOW,
} from './utils/themeClasses'
import { Analytics } from './utils/analytics'

type ActiveMode = 'calculator' | 'challenge' | '24game'

function CalculatorContent() {
  const { theme } = useTheme()
  const { lang } = useTranslation()
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

  return (
    <div className={`min-h-screen flex flex-col transition-all duration-500 relative overflow-hidden ${themeClass(theme, BG_GRADIENT)}`}>
      <BackgroundEffects />
      <AppHeader />

      {/* Main — layout switches based on activeMode */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 md:p-6">
        {/* ═══ CHALLENGE MODE ═══ */}
        {activeMode === 'challenge' && (
          <ModeWrapper onBack={() => switchMode('calculator')}>
            <ChallengeMode onBack={() => switchMode('calculator')} />
          </ModeWrapper>
        )}

        {/* ═══ 24 GAME MODE ═══ */}
        {activeMode === '24game' && (
          <ModeWrapper onBack={() => switchMode('calculator')}>
            <TwentyFourGame onBack={() => switchMode('calculator')} />
          </ModeWrapper>
        )}

        {/* ═══ CALCULATOR MODE ═══ */}
        {activeMode === 'calculator' && (
          <div className="flex flex-col xl:flex-row gap-5 w-full max-w-[1200px] justify-center items-stretch">
            {/* Desktop sidebar */}
            <ModeSidebar switchMode={switchMode} />

            {/* Mobile mode toggles */}
            <MobileModeBar switchMode={switchMode} />

            {/* Calculator + History row */}
            <div className="flex gap-5 w-full max-w-[740px] items-stretch">
              {/* Calculator card */}
              <div
                className={`
                  flex-1 min-w-0 flex flex-col p-6
                  glass-card
                  ${themeClass(theme, GLASS_CARD)}
                  ${themeClass(theme, GLASS_CARD_SHADOW)}
                `}
              >
                <Display displayValue={state.displayValue} expression={state.expression} />
                <ProgrammerMode displayValue={state.displayValue} dispatch={dispatch} />
                <Keypad dispatch={dispatch} />
              </div>

              {/* History card — desktop only */}
              <div
                className={`
                  hidden xl:flex flex-col w-72 p-6
                  glass-card
                  ${themeClass(theme, GLASS_CARD)}
                  ${themeClass(theme, GLASS_CARD_SHADOW)}
                `}
              >
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

      <AppFooter />
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
