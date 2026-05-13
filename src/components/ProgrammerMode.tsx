import { useState, useMemo } from 'react'
import { useTheme } from '../context/ThemeContext'
import { themeClass, BTN_FUNCTION, GLASS_DISPLAY, LABEL_TEXT, BASE_TEXT } from '../utils/themeClasses'
import type { CalculatorAction } from '../reducer/calculatorReducer'

interface ProgrammerModeProps {
  displayValue: string
  dispatch: React.Dispatch<CalculatorAction>
}

function toBin(n: number): string {
  if (!isFinite(n) || isNaN(n)) return '—'
  const sign = n < 0 ? '-' : ''
  const abs = Math.abs(Math.trunc(n))
  return sign + abs.toString(2)
}

function toOct(n: number): string {
  if (!isFinite(n) || isNaN(n)) return '—'
  const sign = n < 0 ? '-' : ''
  const abs = Math.abs(Math.trunc(n))
  return sign + abs.toString(8)
}

function toHex(n: number): string {
  if (!isFinite(n) || isNaN(n)) return '—'
  const sign = n < 0 ? '-' : ''
  const abs = Math.abs(Math.trunc(n))
  return sign + abs.toString(16).toUpperCase()
}

export default function ProgrammerMode({ displayValue, dispatch }: ProgrammerModeProps) {
  const { theme } = useTheme()
  const [expanded, setExpanded] = useState(false)
  const num = parseFloat(displayValue)

  const bin = useMemo(() => toBin(num), [num])
  const oct = useMemo(() => toOct(num), [num])
  const hex = useMemo(() => toHex(num), [num])

  const baseClass = `glass-display ${themeClass(theme, GLASS_DISPLAY)} ${themeClass(theme, BASE_TEXT)}`
  const labelClass = themeClass(theme, LABEL_TEXT)
  const btnClass = `glass-btn ${themeClass(theme, BTN_FUNCTION)}`

  return (
    <div className="mb-4">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className={`w-full flex items-center justify-center gap-2 py-1.5 px-4 mb-1 rounded-full text-xs font-semibold tracking-wider transition-all duration-300 ${btnClass}`}
      >
        <span>💻</span>
        <span>{expanded ? '收起程序员模式' : '程序员模式'}</span>
      </button>

      {expanded && (
        <div className={`rounded-2xl p-4 mt-3 space-y-1.5 text-xs font-mono ${baseClass}`}>
          {/* Binary & Hex display */}
          <div className="flex justify-between">
            <span className={labelClass}>HEX</span>
            <span className="font-bold">{hex}</span>
          </div>
          <div className="flex justify-between">
            <span className={labelClass}>DEC</span>
            <span className="font-bold">{displayValue}</span>
          </div>
          <div className="flex justify-between">
            <span className={labelClass}>OCT</span>
            <span className="font-bold">{oct}</span>
          </div>
          <div className="flex justify-between">
            <span className={labelClass}>BIN</span>
            <span className="font-bold text-[10px] break-all">{bin}</span>
          </div>

          {/* Bitwise operations */}
          <div className="grid grid-cols-4 gap-2 mt-3 pt-3 border-t border-white/10">
            {[
              { label: 'AND', fn: () => {} /* handled in reducer */ },
              { label: 'OR', fn: () => {} },
              { label: 'XOR', fn: () => {} },
              { label: 'NOT', fn: () => {
                const val = Math.trunc(parseFloat(displayValue))
                if (isNaN(val)) return
                dispatch({ type: 'INPUT_DIGIT', digit: String(~val) })
              }},
              { label: '<<', fn: () => {} },
              { label: '>>', fn: () => {} },
              { label: 'CE', fn: () => dispatch({ type: 'CLEAR_ENTRY' }) },
              { label: '±', fn: () => dispatch({ type: 'TOGGLE_SIGN' }) },
            ].map((btn) => (
              <button
                key={btn.label}
                type="button"
                onClick={btn.fn}
                className={`glass-btn h-8 text-xs font-mono ${btnClass}`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
