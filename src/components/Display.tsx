import { useMemo, useRef, useEffect, useState, useCallback } from 'react'
import { useTheme } from '../context/ThemeContext'

interface DisplayProps {
  displayValue: string
  expression: string
}

export default function Display({ displayValue, expression }: DisplayProps) {
  const { theme } = useTheme()
  const prevValueRef = useRef(displayValue)
  const [animKey, setAnimKey] = useState(0)
  const [copied, setCopied] = useState(false)
  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (prevValueRef.current !== displayValue) {
      prevValueRef.current = displayValue
      setAnimKey(k => k + 1)
    }
  }, [displayValue])

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(displayValue)
      setCopied(true)
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current)
      copyTimeoutRef.current = setTimeout(() => setCopied(false), 1500)
    } catch {
      // Fallback for older browsers
      const ta = document.createElement('textarea')
      ta.value = displayValue
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
      setCopied(true)
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current)
      copyTimeoutRef.current = setTimeout(() => setCopied(false), 1500)
    }
  }, [displayValue])

  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current)
    }
  }, [])

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
      ${theme === 'neon' ? 'glass-display-neon' : theme === 'retro' ? 'glass-display-retro' : theme === 'light' ? 'glass-display-light' : 'glass-display-dark'}
    `}>
      {/* Expression / history line */}
      <div className={`
        w-full text-right truncate text-xs h-4 mb-2 font-mono tracking-wider
        ${theme === 'neon' ? 'text-cyan-400/60' : theme === 'retro' ? 'text-emerald-600/60' : theme === 'light' ? 'text-gray-400/80' : 'text-gray-500/70'}
      `}>
        {expression || '\u00A0'}
      </div>

      {/* Main display row with copy button */}
      <div className="w-full flex items-center justify-end gap-2">
        {/* Main display with typing animation */}
        <div
          key={animKey}
          className={`
            text-right font-mono font-bold tracking-tight
            break-all overflow-hidden leading-tight
            ${fontSize}
            ${theme === 'neon' ? 'text-cyan-300' : theme === 'retro' ? 'text-emerald-900' : theme === 'light' ? 'text-gray-900' : 'text-white'}
            display-digit
          `}
        >
          {displayValue}
        </div>

        {/* Copy button */}
        <button
          type="button"
          onClick={handleCopy}
          title={copied ? '已复制' : '复制结果'}
          className={`
            flex-shrink-0 w-8 h-8 rounded-lg
            flex items-center justify-center
            transition-all duration-200
            text-sm
            ${copied
              ? (theme === 'neon' ? 'bg-cyan-500/20 text-cyan-300 scale-110' : theme === 'retro' ? 'bg-emerald-100 text-emerald-600 scale-110' : theme === 'light' ? 'bg-green-100 text-green-600 scale-110' : 'bg-green-500/20 text-green-400 scale-110')
              : (theme === 'neon'
                ? 'text-cyan-500/50 hover:text-cyan-300 hover:bg-cyan-500/10'
                : theme === 'retro'
                  ? 'text-emerald-400 hover:text-emerald-600 hover:bg-emerald-50'
                  : theme === 'light'
                    ? 'text-gray-400 hover:text-gray-600 hover:bg-black/5'
                    : 'text-gray-500 hover:text-gray-300 hover:bg-white/5')
            }
          `}
        >
          {copied ? '✓' : '📋'}
        </button>
      </div>
    </div>
  )
}
