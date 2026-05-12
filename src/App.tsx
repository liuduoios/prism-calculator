import { useReducer } from 'react'
import { ThemeProvider, useTheme } from './context/ThemeContext'
import { calculatorReducer, initialState } from './reducer/calculatorReducer'
import { useKeyboard } from './hooks/useKeyboard'
import Display from './components/Display'
import Keypad from './components/Keypad'
import History from './components/History'
import ThemeToggle from './components/ThemeToggle'

function CalculatorContent() {
  const { theme } = useTheme()
  const [state, dispatch] = useReducer(calculatorReducer, initialState)
  useKeyboard(dispatch)

  const lightGradient = 'bg-gradient-to-br from-gray-100 via-gray-50 to-blue-50'
  const darkGradient = 'bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800'
  const lightCard = 'bg-white/80 backdrop-blur-xl border border-white/50 shadow-gray-200/50'
  const darkCard = 'bg-gray-900/80 backdrop-blur-xl border border-gray-700/50 shadow-black/30'

  return (
    <div className={`h-full w-full flex items-center justify-center p-4 transition-colors duration-300 ${theme === 'light' ? lightGradient : darkGradient}`}>
      <div className="flex gap-4 w-full max-w-[960px] h-[90vh] max-h-[800px]">
        <div className={`flex-1 max-w-[420px] flex flex-col p-5 rounded-3xl shadow-2xl transition-all duration-300 ${theme === 'light' ? lightCard : darkCard}`}>
          <div className="flex items-center justify-between mb-4">
            <h1 className={`text-lg font-bold tracking-tight ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
              计算器
            </h1>
            <ThemeToggle />
          </div>
          <Display
            displayValue={state.displayValue}
            expression={state.expression}
          />
          <Keypad dispatch={dispatch} />
        </div>
        <div className={`hidden lg:flex flex-col w-72 rounded-3xl p-5 shadow-2xl transition-all duration-300 ${theme === 'light' ? lightCard : darkCard}`}>
          <History
            history={state.history}
            onSelect={(item) => dispatch({ type: 'SELECT_HISTORY', item })}
            onClear={() => dispatch({ type: 'CLEAR_HISTORY' })}
          />
        </div>
      </div>
    </div>
  )
}

function App() {
  return (
    <ThemeProvider>
      <CalculatorContent />
    </ThemeProvider>
  )
}

export default App
