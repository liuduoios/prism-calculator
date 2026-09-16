import { useState } from 'react'
import { useTheme } from '../context/ThemeContext'
import { useTranslation } from '../context/LanguageContext'
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
  theme: string,
): string {
  const base = `glass-btn w-full h-14 text-base md:text-lg`

  const variantMap: Record<string, Record<ButtonConfig['variant'], string>> = {
    light: {
      number: 'glass-btn-number-light',
      operator: 'glass-btn-operator-light',
      function: 'glass-btn-function-light',
      equals: 'glass-btn-equals-light',
      clear: 'glass-btn-clear-light',
      scientific: 'glass-btn-sci-light',
    },
    dark: {
      number: 'glass-btn-number-dark',
      operator: 'glass-btn-operator-dark',
      function: 'glass-btn-function-dark',
      equals: 'glass-btn-equals-dark',
      clear: 'glass-btn-clear-dark',
      scientific: 'glass-btn-sci-dark',
    },
    neon: {
      number: 'glass-btn-number-neon',
      operator: 'glass-btn-operator-neon',
      function: 'glass-btn-function-neon',
      equals: 'glass-btn-equals-neon',
      clear: 'glass-btn-clear-neon',
      scientific: 'glass-btn-sci-neon',
    },
    retro: {
      number: 'glass-btn-number-retro',
      operator: 'glass-btn-operator-retro',
      function: 'glass-btn-function-retro',
      equals: 'glass-btn-equals-retro',
      clear: 'glass-btn-clear-retro',
      scientific: 'glass-btn-sci-retro',
    },
  }

  return `${base} ${variantMap[theme]?.[variant] ?? variantMap.light[variant]}`
}

export default function Keypad({ dispatch }: KeypadProps) {
  const { theme } = useTheme()
  const { t } = useTranslation()
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
      {/* Scientific toggle — refined glass chip style */}
      <button
        type="button"
        onClick={() => setShowScientific(!showScientific)}
        className={`
          w-full flex items-center justify-center gap-2.5
          py-2 px-4 mb-5 rounded-full text-xs font-semibold tracking-wider
          transition-all duration-300
          glass-btn
          ${
            theme === 'light'
              ? 'glass-btn-function-light'
              : theme === 'retro'
                ? 'glass-btn-function-retro'
                : theme === 'neon'
                  ? 'glass-btn-function-neon'
                  : 'glass-btn-function-dark'
          }
          ${showScientific
            ? (theme === 'light' || theme === 'retro'
              ? '!bg-purple-100/60 !border-purple-300/40 !text-purple-600'
              : '!bg-purple-500/10 !border-purple-400/20 !text-purple-400')
            : ''
          }
        `}
      >
        {/* Icon */}
        <span className={`text-sm transition-transform duration-300 ${showScientific ? 'rotate-45' : ''}`}>
          ▸
        </span>
        <span>{showScientific ? t('sci.collapse') : t('sci.expand')}</span>
        <span className={`text-xs opacity-60 ${showScientific ? 'order-first -rotate-45' : ''}`}>
          fn
        </span>
      </button>

      {/* Scientific grid */}
      {showScientific && (
        <>
          <div className="grid grid-cols-4 gap-2.5 mb-3">
            {scientificButtons.map((btn) => (
              <button
                key={btn.label}
                type="button"
                onClick={btn.action}
                className={`${getButtonStyles(btn.variant, theme)} text-xs font-mono h-11`}
              >
                {btn.label}
              </button>
            ))}
          </div>
          {/* Divider */}
          <div className={`
            w-full h-px mb-5 rounded-full
            ${theme === 'light' || theme === 'retro' ? 'bg-black/8' : 'bg-white/8'}
          `} />
        </>
      )}

      {/* Basic grid */}
      <div className="grid grid-cols-4 gap-2.5">
        {basicButtons.map((btn) => (
          <button
            key={btn.label + btn.variant}
            type="button"
            onClick={btn.action}
            className={
              getButtonStyles(btn.variant, theme) +
              (btn.variant === 'number' ? ' font-semibold' : '') +
              (btn.variant === 'equals' ? ' text-xl tracking-wider' : '')
            }
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* Memory row */}
      <div className="grid grid-cols-4 gap-2.5 mt-2.5">
        {[
          { label: t('memory.clear'), action: () => dispatch({ type: 'MEMORY_CLEAR' }) },
          { label: t('memory.recall'), action: () => dispatch({ type: 'MEMORY_RECALL' }) },
          { label: t('memory.add'), action: () => dispatch({ type: 'MEMORY_ADD' }) },
          { label: t('memory.subtract'), action: () => dispatch({ type: 'MEMORY_SUBTRACT' }) },
        ].map((btn) => (
          <button
            key={btn.label}
            type="button"
            onClick={btn.action}
            className={`glass-btn w-full h-10 text-xs font-semibold tracking-wider font-mono
              ${theme === 'light' || theme === 'retro'
                ? 'glass-btn-function-light text-amber-600'
                : 'glass-btn-function-dark text-amber-400'
              }
            `}
          >
            {btn.label}
          </button>
        ))}
      </div>
    </div>
  )
}
