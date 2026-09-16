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
  const headerBar = theme === 'light'
    ? 'bg-white/60 backdrop-blur-md border-b border-gray-200/50'
    : 'bg-gray-900/60 backdrop-blur-md border-b border-gray-700/50'
  const footerText = theme === 'light' ? 'text-gray-400' : 'text-gray-500'

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${theme === 'light' ? lightGradient : darkGradient}`}>
      {/* Header */}
      <header className={`sticky top-0 z-10 px-6 py-3 flex items-center justify-between ${headerBar}`}>
        <div className="flex items-center gap-3">
          <span className="text-2xl">🧮</span>
          <span className={`text-lg font-bold tracking-tight ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
            精美计算器
          </span>
        </div>
        <ThemeToggle />
      </header>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="flex gap-4 w-full max-w-[960px] justify-center h-[80vh] max-h-[750px]">
          <div className={`w-full max-w-[420px] flex flex-col p-5 rounded-3xl shadow-2xl transition-all duration-300 ${theme === 'light' ? lightCard : darkCard}`}>
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
      </main>

      {/* Footer */}
      <footer className={`py-4 text-center text-sm ${footerText}`}>
        <p>&copy; {new Date().getFullYear()} 精美计算器 &mdash; 使用 React + TypeScript + Tailwind CSS 构建</p>
      </footer>
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
