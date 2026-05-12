import { useMemo, useRef, useEffect, useState } from 'react'
import { useTheme } from '../context/ThemeContext'

interface DisplayProps {
  displayValue: string
  expression: string
}

export default function Display({ displayValue, expression }: DisplayProps) {
  const { theme } = useTheme()
  const isLight = theme === 'light'
  const prevValueRef = useRef(displayValue)
  const [animKey, setAnimKey] = useState(0)

  useEffect(() => {
    if (prevValueRef.current !== displayValue) {
      prevValueRef.current = displayValue
      setAnimKey(k => k + 1)
    }
  }, [displayValue])

  const fontSize = useMemo(() => {
    const len = displayValue.length
    if (len <= 10) return 'text-5xl md:text-5xl'
    if (len <= 14) return 'text-4xl md:text-4xl'
    if (len <= 18) return 'text-3xl md:text-3xl'
    return 'text-2xl md:text-2xl'
  }, [displayValue])

  return (
    <div className={`
      w-full rounded-2xl px-6 py-5 mb-4
      flex flex-col items-end justify-end
      min-h-[110px]
      glass-display
      ${isLight ? 'glass-display-light' : 'glass-display-dark'}
    `}>
      {/* Expression / history line */}
      <div className={`
        w-full text-right truncate text-xs h-4 mb-2 font-mono tracking-wider
        ${isLight ? 'text-gray-400/80' : 'text-gray-500/70'}
      `}>
        {expression || '\u00A0'}
      </div>

      {/* Main display with typing animation */}
      <div
        key={animKey}
        className={`
          w-full text-right font-mono font-bold tracking-tight
          break-all overflow-hidden leading-tight
          ${fontSize}
          ${isLight ? 'text-gray-900' : 'text-white'}
          display-digit
        `}
      >
        {displayValue}
      </div>
    </div>
  )
}
