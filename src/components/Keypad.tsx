import { useState } from 'react'
import { useTheme } from '../context/ThemeContext'
import type { CalculatorAction } from '../reducer/calculatorReducer'

interface KeypadProps {
  dispatch: React.Dispatch<CalculatorAction>
}

interface ButtonConfig {
  label: string
  action: () => void
  variant: 'number' | 'operator' | 'function' | 'equals' | 'clear' | 'scientific'
  span?: number
}

type ButtonVariants = {
  number: string
  operator: string
  function: string
  equals: string
  clear: string
  scientific: string
}

function getButtonStyles(
  variant: ButtonConfig['variant'],
  theme: 'light' | 'dark',
  isSci: boolean,
): string {
  const base = `
    w-full h-14 rounded-xl text-lg font-medium
    transition-all duration-150
    active:scale-95 active:opacity-80
    select-none cursor-pointer
    shadow-sm
    hover:brightness-110
  `

  const lightVariants: ButtonVariants = {
    number: 'bg-white text-gray-800 hover:bg-gray-50 border border-gray-200',
    operator: 'bg-orange-100 text-orange-600 hover:bg-orange-200 border border-orange-200',
    function: 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200',
    equals: 'bg-orange-500 text-white hover:bg-orange-600 border border-orange-500',
    clear: 'bg-red-100 text-red-500 hover:bg-red-200 border border-red-200',
    scientific: isSci
      ? 'bg-purple-500 text-white hover:bg-purple-600 border border-purple-500'
      : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200',
  }

  const darkVariants: ButtonVariants = {
    number: 'bg-gray-700 text-white hover:bg-gray-600 border border-gray-600',
    operator: 'bg-orange-900/40 text-orange-400 hover:bg-orange-900/60 border border-orange-800/50',
    function: 'bg-gray-600 text-gray-300 hover:bg-gray-500 border border-gray-500',
    equals: 'bg-orange-500 text-white hover:bg-orange-600 border border-orange-500',
    clear: 'bg-red-900/40 text-red-400 hover:bg-red-900/60 border border-red-800/50',
    scientific: isSci
      ? 'bg-purple-500 text-white hover:bg-purple-600 border border-purple-500'
      : 'bg-gray-600 text-gray-300 hover:bg-gray-500 border border-gray-500',
  }

  const variants = theme === 'light' ? lightVariants : darkVariants
  return `${base} ${variants[variant]}`
}

export default function Keypad({ dispatch }: KeypadProps) {
  const { theme } = useTheme()
  const [showScientific, setShowScientific] = useState(false)

  const digit = (d: string) => () => dispatch({ type: 'INPUT_DIGIT', digit: d })
  const operator = (op: string) => () => dispatch({ type: 'INPUT_OPERATOR', operator: op })
  const sci = (func: string) => () => dispatch({ type: 'SCIENTIFIC', func })

  const basicButtons: ButtonConfig[] = [
    { label: 'C', action: () => dispatch({ type: 'CLEAR' }), variant: 'clear' },
    { label: '⌫', action: () => dispatch({ type: 'BACKSPACE' }), variant: 'function' },
    { label: '%', action: () => dispatch({ type: 'PERCENT' }), variant: 'function' },
    { label: '÷', action: operator('÷'), variant: 'operator' },

    { label: '7', action: digit('7'), variant: 'number' },
    { label: '8', action: digit('8'), variant: 'number' },
    { label: '9', action: digit('9'), variant: 'number' },
    { label: '×', action: operator('×'), variant: 'operator' },

    { label: '4', action: digit('4'), variant: 'number' },
    { label: '5', action: digit('5'), variant: 'number' },
    { label: '6', action: digit('6'), variant: 'number' },
    { label: '−', action: operator('−'), variant: 'operator' },

    { label: '1', action: digit('1'), variant: 'number' },
    { label: '2', action: digit('2'), variant: 'number' },
    { label: '3', action: digit('3'), variant: 'number' },
    { label: '+', action: operator('+'), variant: 'operator' },

    { label: '±', action: () => dispatch({ type: 'TOGGLE_SIGN' }), variant: 'function' },
    { label: '0', action: digit('0'), variant: 'number' },
    { label: '.', action: () => dispatch({ type: 'INPUT_DECIMAL' }), variant: 'number' },
    { label: '=', action: () => dispatch({ type: 'EVALUATE' }), variant: 'equals' },
  ]

  const scientificButtons: ButtonConfig[] = [
    { label: 'sin', action: sci('sin'), variant: 'scientific' },
    { label: 'cos', action: sci('cos'), variant: 'scientific' },
    { label: 'tan', action: sci('tan'), variant: 'scientific' },
    { label: 'log', action: sci('log'), variant: 'scientific' },
    { label: 'ln', action: sci('ln'), variant: 'scientific' },
    { label: '√x', action: sci('√'), variant: 'scientific' },
    { label: 'x²', action: sci('x²'), variant: 'scientific' },
    { label: 'xʸ', action: operator('^'), variant: 'scientific' },
    { label: 'π', action: digit(String(Math.PI)), variant: 'scientific' },
    { label: 'e', action: digit(String(Math.E)), variant: 'scientific' },
    { label: '1/x', action: sci('1/x'), variant: 'scientific' },
    { label: '|x|', action: sci('|x|'), variant: 'scientific' },
    { label: 'asin', action: sci('asin'), variant: 'scientific' },
    { label: 'acos', action: sci('acos'), variant: 'scientific' },
    { label: 'atan', action: sci('atan'), variant: 'scientific' },
    { label: '!', action: sci('!'), variant: 'scientific' },
  ]

  return (
    <div>
      {/* Scientific toggle */}
      <button
        onClick={() => setShowScientific(!showScientific)}
        className={`
          w-full py-2 mb-3 rounded-xl text-sm font-medium transition-all duration-200
          ${showScientific
            ? 'bg-purple-500/20 text-purple-600 dark:text-purple-400'
            : theme === 'light'
              ? 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
          }
        `}
      >
        {showScientific ? '🔬 收起科学计算' : '🔬 展开科学计算'}
      </button>

      {/* Scientific grid */}
      {showScientific && (
        <div className="grid grid-cols-4 gap-2 mb-3">
          {scientificButtons.map((btn) => (
            <button
              key={btn.label}
              onClick={btn.action}
              className={getButtonStyles(btn.variant, theme, showScientific)}
            >
              {btn.label}
            </button>
          ))}
        </div>
      )}

      {/* Basic grid */}
      <div className="grid grid-cols-4 gap-2">
        {basicButtons.map((btn) => (
          <button
            key={btn.label + btn.variant}
            onClick={btn.action}
            className={getButtonStyles(btn.variant, theme, showScientific)}
          >
            {btn.label}
          </button>
        ))}
      </div>
    </div>
  )
}
