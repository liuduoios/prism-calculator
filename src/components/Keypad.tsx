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

function getButtonStyles(
  variant: ButtonConfig['variant'],
  isLight: boolean,
): string {
  const base = `glass-btn w-full h-14 text-base md:text-lg`

  const variantMap: Record<ButtonConfig['variant'], string> = {
    number: isLight ? 'glass-btn-number-light' : 'glass-btn-number-dark',
    operator: isLight ? 'glass-btn-operator-light' : 'glass-btn-operator-dark',
    function: isLight ? 'glass-btn-function-light' : 'glass-btn-function-dark',
    equals: isLight ? 'glass-btn-equals-light' : 'glass-btn-equals-dark',
    clear: isLight ? 'glass-btn-clear-light' : 'glass-btn-clear-dark',
    scientific: isLight ? 'glass-btn-sci-light' : 'glass-btn-sci-dark',
  }

  return `${base} ${variantMap[variant]}`
}

export default function Keypad({ dispatch }: KeypadProps) {
  const { theme } = useTheme()
  const isLight = theme === 'light'
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
          w-full py-2.5 mb-3 rounded-2xl text-sm font-semibold tracking-wide
          transition-all duration-300
          glass-btn
          ${showScientific
            ? (isLight
              ? 'glass-btn-sci-light bg-purple-500/15'
              : 'glass-btn-sci-dark')
            : (isLight
              ? 'glass-btn-function-light'
              : 'glass-btn-function-dark')
          }
        `}
      >
        <span className="flex items-center justify-center gap-2">
          <span>{showScientific ? '🔬' : '🔬'}</span>
          <span>{showScientific ? '收起科学计算' : '展开科学计算'}</span>
        </span>
      </button>

      {/* Scientific grid */}
      {showScientific && (
        <div className="grid grid-cols-4 gap-2.5 mb-3">
          {scientificButtons.map((btn) => (
            <button
              key={btn.label}
              onClick={btn.action}
              className={`${getButtonStyles(btn.variant, isLight)} text-xs font-mono`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      )}

      {/* Basic grid */}
      <div className="grid grid-cols-4 gap-2.5">
        {basicButtons.map((btn) => (
          <button
            key={btn.label + btn.variant}
            onClick={btn.action}
            className={
              getButtonStyles(btn.variant, isLight) +
              (btn.variant === 'number' ? ' font-semibold' : '') +
              (btn.variant === 'equals' ? ' text-xl tracking-wider' : '')
            }
          >
            {btn.label}
          </button>
        ))}
      </div>
    </div>
  )
}
