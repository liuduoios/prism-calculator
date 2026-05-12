import { useMemo } from 'react'
import { useTheme } from '../context/ThemeContext'

interface DisplayProps {
  displayValue: string
  expression: string
}

export default function Display({ displayValue, expression }: DisplayProps) {
  const { theme } = useTheme()

  const fontSize = useMemo(() => {
    const len = displayValue.length
    if (len <= 10) return 'text-5xl'
    if (len <= 14) return 'text-4xl'
    if (len <= 18) return 'text-3xl'
    return 'text-2xl'
  }, [displayValue])

  return (
    <div className={`
      w-full rounded-2xl px-6 py-4 mb-3 flex flex-col items-end justify-end min-h-[100px]
      transition-colors duration-300
      ${theme === 'light'
        ? 'bg-gray-100 text-gray-900'
        : 'bg-gray-800 text-white'
      }
    `}>
      {/* Expression / history line */}
      <div className={`
        w-full text-right truncate text-sm h-5 mb-1 font-mono tracking-wider
        ${theme === 'light' ? 'text-gray-400' : 'text-gray-500'}
      `}>
        {expression || '\u00A0'}
      </div>

      {/* Main display */}
      <div className={`
        w-full text-right font-mono font-semibold tracking-tight transition-all duration-150
        break-all overflow-hidden
        ${fontSize}
        ${theme === 'light' ? 'text-gray-900' : 'text-white'}
      `}>
        {displayValue}
      </div>
    </div>
  )
}
