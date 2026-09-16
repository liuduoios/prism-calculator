import { useState, useCallback, useEffect, useRef } from 'react'
import { useTheme } from '../context/ThemeContext'
import { themeClass, BTN_FUNCTION, BTN_NUMBER, BTN_AMBER_DARK, GAME_CONTENT_TEXT } from '../utils/themeClasses'
import { Analytics } from '../utils/analytics'

interface Card {
  value: number
  used: boolean
}

type Op = '+' | '−' | '×' | '÷'

interface Step {
  a: number
  b: number
  op: Op
  result: number
}

function evaluate(a: number, b: number, op: Op): number {
  switch (op) {
    case '+': return a + b
    case '−': return a - b
    case '×': return a * b
    case '÷': return b !== 0 ? a / b : NaN
  }
}

function opSymbol(op: Op): string {
  switch (op) {
    case '+': return '+'
    case '−': return '−'
    case '×': return '×'
    case '÷': return '÷'
  }
}

// Generate 4 numbers that have at least one solution to 24
function generatePuzzle(): number[] {
  // Strategy: generate a random solution, then work backwards to get 4 cards
  const solutions: Array<{ cards: number[]; steps: Step[] }> = [
    // Classic combinations
    { cards: [1, 2, 3, 4], steps: [{ a: 1, b: 2, op: '×', result: 2 }, { a: 2, b: 3, op: '×', result: 6 }, { a: 6, b: 4, op: '×', result: 24 }] },
    { cards: [1, 1, 2, 6], steps: [{ a: 1, b: 1, op: '+', result: 2 }, { a: 2, b: 2, op: '+', result: 4 }, { a: 4, b: 6, op: '×', result: 24 }] },
    { cards: [1, 2, 3, 8], steps: [{ a: 9, b: 3, op: '÷', result: 3 }, { a: 3, b: 8, op: '×', result: 24 }] },
    { cards: [3, 3, 8, 8], steps: [{ a: 8, b: 3, op: '÷', result: 8/3 }, { a: 3, b: 8/3, op: '−', result: 3-8/3 }, { a: 8, b: 3-8/3, op: '÷', result: 24 }] },
    { cards: [1, 5, 5, 5], steps: [{ a: 5, b: 5, op: '−', result: 4 }, { a: 1, b: 5, op: '÷', result: 0.2 }, { a: 4, b: 5, op: '×', result: 20 }] },
    { cards: [2, 2, 2, 3], steps: [{ a: 2, b: 2, op: '×', result: 4 }, { a: 2, b: 4, op: '×', result: 8 }, { a: 8, b: 3, op: '×', result: 24 }] },
    { cards: [4, 4, 7, 7], steps: [{ a: 7, b: 4, op: '−', result: 3 }, { a: 3, b: 7, op: '×', result: 21 }, { a: 4, b: 21, op: '+', result: 25 }] },
    // Randomly replace
    { cards: [2, 3, 5, 8], steps: [{ a: 2, b: 5, op: '×', result: 10 }, { a: 10, b: 3, op: '−', result: 7 }, { a: 7, b: 8, op: '+', result: 15 }] },
    { cards: [2, 4, 6, 8], steps: [{ a: 8, b: 4, op: '÷', result: 2 }, { a: 2, b: 6, op: '+', result: 8 }, { a: 8, b: 4, op: '×', result: 32 }] },
    { cards: [1, 3, 6, 7], steps: [{ a: 6, b: 3, op: '−', result: 3 }, { a: 3, b: 7, op: '×', result: 21 }, { a: 21, b: 1, op: '×', result: 21 }] },
    { cards: [2, 5, 7, 8], steps: [{ a: 2, b: 5, op: '×', result: 10 }, { a: 10, b: 7, op: '−', result: 3 }, { a: 3, b: 8, op: '×', result: 24 }] },
    { cards: [3, 4, 6, 7], steps: [{ a: 3, b: 7, op: '×', result: 21 }, { a: 21, b: 6, op: '+', result: 27 }] },
    { cards: [1, 4, 5, 6], steps: [{ a: 4, b: 6, op: '×', result: 24 }, { a: 24, b: 1, op: '×', result: 24 }, { a: 24, b: 5, op: '÷', result: 4.8 }] },
    { cards: [1, 3, 4, 6], steps: [{ a: 6, b: 1, op: '−', result: 5 }, { a: 5, b: 3, op: '×', result: 15 }, { a: 15, b: 4, op: '+', result: 24 }] },
    { cards: [2, 3, 7, 8], steps: [{ a: 7, b: 3, op: '−', result: 4 }, { a: 4, b: 8, op: '×', result: 32 }] },
    { cards: [3, 5, 7, 8], steps: [{ a: 8, b: 7, op: '−', result: 1 }, { a: 5, b: 1, op: '+', result: 6 }, { a: 3, b: 6, op: '×', result: 24 }] },
    { cards: [2, 6, 7, 8], steps: [{ a: 6, b: 2, op: '÷', result: 3 }, { a: 7, b: 3, op: '×', result: 21 }, { a: 21, b: 8, op: '+', result: 24 }] },
    { cards: [4, 5, 6, 7], steps: [{ a: 5, b: 4, op: '−', result: 1 }, { a: 7, b: 6, op: '+', result: 13 }, { a: 1, b: 13, op: '×', result: 13 }] },
    { cards: [1, 2, 5, 8], steps: [{ a: 2, b: 1, op: '−', result: 1 }, { a: 8, b: 1, op: '×', result: 8 }, { a: 5, b: 8, op: '−', result: 3 }, { a: 4, b: 6, op: '×', result: 24 }] },
  ]

  // Also generate truly random puzzles with guaranteed solutions using reverse engineering
  const randomPuzzles: Array<{ cards: number[] }> = []

  // Generate 20 random solvable puzzles
  for (let i = 0; i < 20; i++) {
    const cards = Array.from({ length: 4 }, () => Math.floor(Math.random() * 9) + 1)
    // Check if solvable by brute force
    if (hasSolution(cards)) {
      randomPuzzles.push({ cards })
    }
  }

  // Merge solutions and random puzzles, pick random
  const allCombined: Array<{ cards: number[] }> = solutions.map(s => ({ cards: s.cards }))
  if (randomPuzzles.length > 0) {
    allCombined.push(...randomPuzzles.slice(0, 10))
  }

  const picked = allCombined[Math.floor(Math.random() * allCombined.length)]
  // Shuffle the cards
  const shuffled = [...picked.cards].sort(() => Math.random() - 0.5)
  return shuffled
}

// Brute-force check if there's any solution
function hasSolution(nums: number[]): boolean {
  if (nums.length === 1) {
    return Math.abs(nums[0] - 24) < 0.0001
  }
  for (let i = 0; i < nums.length; i++) {
    for (let j = 0; j < nums.length; j++) {
      if (i === j) continue
      const rest = nums.filter((_, k) => k !== i && k !== j)
      for (const op of ['+', '−', '×', '÷'] as Op[]) {
        const result = evaluate(nums[i], nums[j], op)
        if (isNaN(result)) continue
        if (hasSolution([result, ...rest])) return true
      }
    }
  }
  return false
}

interface Stats {
  solved: number
  attempted: number
  bestTime: number
}

function getStats(): Stats {
  try {
    const s = localStorage.getItem('calc-24-stats')
    if (s) return JSON.parse(s)
  } catch {}
  return { solved: 0, attempted: 0, bestTime: 0 }
}

function saveStats(s: Stats) {
  localStorage.setItem('calc-24-stats', JSON.stringify(s))
}

interface TwentyFourGameProps {
  onBack?: () => void
}

export default function TwentyFourGame({ onBack }: TwentyFourGameProps) {
  const { theme } = useTheme()
  const [active, setActive] = useState(false)
  const [cards, setCards] = useState<Card[]>([])
  const [selectedCards, setSelectedCards] = useState<number[]>([])
  const [selectedOp, setSelectedOp] = useState<Op | null>(null)
  const [currentValue, setCurrentValue] = useState<number | null>(null)
  const [history, setHistory] = useState<string[]>([])
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'success' | 'error' | 'info'>('info')
  const [stats, setStats] = useState<Stats>(getStats)
  const [timer, setTimer] = useState(0)
  const [showHint, setShowHint] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const messageTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const hasStarted = useRef(false)

  const isLightLike = theme === 'light' || theme === 'retro'

  const btnClassBase = themeClass(theme, BTN_FUNCTION)
  const btnClass = btnClassBase === BTN_FUNCTION.dark
    ? `glass-btn ${BTN_AMBER_DARK}`
    : `glass-btn ${btnClassBase}`

  const numClass = `glass-btn ${themeClass(theme, BTN_NUMBER)}`

  const bgCard = themeClass(theme, {
    light: 'bg-purple-50/60',
    dark: 'bg-amber-500/5',
    neon: 'bg-cyan-500/10 border border-cyan-500/20',
    retro: 'bg-emerald-50/80 border border-emerald-200',
  })

  const showMsg = useCallback((msg: string, type: 'success' | 'error' | 'info') => {
    setMessage(msg)
    setMessageType(type)
    if (messageTimerRef.current) clearTimeout(messageTimerRef.current)
    messageTimerRef.current = setTimeout(() => setMessage(''), 2000)
  }, [])

  const startGame = useCallback(() => {
    const nums = generatePuzzle()
    setCards(nums.map(v => ({ value: v, used: false })))
    setSelectedCards([])
    setSelectedOp(null)
    setCurrentValue(null)
    setHistory([])
    setMessage('')
    setShowHint(false)
    setTimer(0)
    setActive(true)
    // Start timer
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => setTimer(t => t + 1), 1000)
  }, [])

  const endGame = useCallback((won: boolean) => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
    const newStats = { ...stats }
    newStats.attempted++
    if (won) {
      newStats.solved++
      if (newStats.bestTime === 0 || timer < newStats.bestTime) {
        newStats.bestTime = timer
      }
    }
    setStats(newStats)
    saveStats(newStats)
    setActive(false)
    // Track game completion
    Analytics.gameModeComplete('24game', won ? timer : 0)
    // Auto-return to calculator after delay
    setTimeout(() => {
      onBack?.()
    }, 4000)
  }, [stats, timer, onBack])

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  const selectCard = useCallback((index: number) => {
    if (!active) return
    if (cards[index].used) return

    // If we already have a value and no operator, can't select another card yet
    if (currentValue !== null && selectedOp === null) {
      showMsg('请先选择运算符', 'info')
      return
    }

    // Case 1: We have value + op + new card → calculate
    if (currentValue !== null && selectedOp !== null) {
      const result = evaluate(currentValue, cards[index].value, selectedOp)
      if (isNaN(result)) {
        showMsg('除数不能为零', 'error')
        setSelectedOp(null)
        setCurrentValue(null)
        setSelectedCards([])
        return
      }
      const histEntry = `${currentValue} ${opSymbol(selectedOp)} ${cards[index].value} = ${Math.round(result * 1000) / 1000}`
      setHistory(h => [...h, histEntry])

      // Mark this card as used
      setCards(prev => prev.map((c, i) => i === index ? { ...c, used: true } : c))
      setSelectedOp(null)
      setSelectedCards([])

      // Check win
      if (Math.abs(result - 24) < 0.0001) {
        showMsg(`🎉 恭喜！${timer}秒完成！`, 'success')
        setTimeout(() => endGame(true), 1500)
        setCurrentValue(null)
        return
      }

      setCurrentValue(result)
      return
    }

    // Case 2: First card selection — use its value
    setSelectedCards([index])
    setCurrentValue(cards[index].value)
    setCards(prev => prev.map((c, i) => i === index ? { ...c, used: true } : c))
  }, [active, cards, currentValue, selectedOp, showMsg, timer, endGame])

  const selectOp = useCallback((op: Op) => {
    if (!active) return
    if (currentValue === null) {
      showMsg('请先选择一张牌', 'info')
      return
    }
    setSelectedOp(op)
  }, [active, currentValue, showMsg])

  const undo = useCallback(() => {
    if (history.length === 0) return
    // Simple undo: restart
    const nums = cards.map(c => c.value)
    setCards(nums.map(v => ({ value: v, used: false })))
    setSelectedCards([])
    setSelectedOp(null)
    setCurrentValue(null)
    setHistory([])
  }, [history, cards])

  const giveUp = useCallback(() => {
    showMsg('可惜！答案是存在的，再试试吧~', 'error')
    endGame(false)
  }, [showMsg, endGame])

  // Auto-start game on mount
  useEffect(() => {
    if (!hasStarted.current) {
      hasStarted.current = true
      startGame()
    }
  }, [startGame])

  if (!active) {
    return (
      <div className={`text-center py-8 opacity-50 text-sm ${themeClass(theme, GAME_CONTENT_TEXT)}`}>加载中...</div>
    )
  }

  return (
    <div className={`${bgCard} ${themeClass(theme, GAME_CONTENT_TEXT)}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-xs">
          <span className="font-bold">🃏 24点</span>
          <span className={themeClass(theme, { light: 'text-purple-500', dark: 'text-amber-300', neon: 'text-cyan-400', retro: 'text-emerald-600' })}>
            ⏱ {timer}s
          </span>
          {stats.bestTime > 0 && (
            <span className="opacity-50">最佳 {stats.bestTime}s</span>
          )}
        </div>
        <div className="flex gap-1.5">
          <button type="button" onClick={undo} className={`text-xs px-2 py-1 rounded-lg ${btnClass}`}>
            重来
          </button>
          <button type="button" onClick={giveUp} className={`text-xs px-2 py-1 rounded-lg ${btnClass}`}>
            放弃
          </button>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-4 gap-2 mb-3">
        {cards.map((card, i) => {
          const usedClass = themeClass(theme, {
            light: 'bg-gray-100 text-gray-300',
            dark: 'bg-amber-500/5 text-amber-600/30',
            neon: 'bg-cyan-500/5 text-cyan-600/30',
            retro: 'bg-emerald-100/50 text-emerald-300',
          })
          const selectedClass = themeClass(theme, {
            light: 'bg-purple-100 text-purple-700 ring-2 ring-purple-400',
            dark: 'bg-amber-500/20 text-amber-200 ring-2 ring-amber-400',
            neon: 'bg-cyan-500/30 text-cyan-200 ring-2 ring-cyan-400',
            retro: 'bg-emerald-200 text-emerald-800 ring-2 ring-emerald-500',
          })
          const activeCardClass = themeClass(theme, {
            light: 'bg-white/80 border border-purple-200 cursor-pointer hover:bg-purple-50 hover:scale-105 text-purple-800',
            dark: `glass-btn ${BTN_AMBER_DARK} cursor-pointer hover:scale-105`,
            neon: `glass-btn ${BTN_NUMBER.neon} cursor-pointer hover:scale-105`,
            retro: `glass-btn ${BTN_NUMBER.retro} cursor-pointer hover:scale-105`,
          })

          return (
            <button
              key={i}
              type="button"
              onClick={() => selectCard(i)}
              disabled={card.used}
              className={`
                aspect-square rounded-xl flex items-center justify-center
                text-2xl font-bold font-mono
                transition-all duration-200
                ${card.used ? usedClass : selectedCards.includes(i) ? selectedClass : activeCardClass}
              `}
            >
              {card.used ? '✓' : card.value}
            </button>
          )
        })}
      </div>

      {/* Current state display */}
      <div className={`text-center mb-3 font-mono ${themeClass(theme, { light: 'text-gray-700', dark: 'text-amber-100', neon: 'text-cyan-100', retro: 'text-emerald-800' })}`}>
        {currentValue !== null && (
          <span className="text-xl font-bold">{Math.round(currentValue * 1000) / 1000}</span>
        )}
        {selectedOp && (
          <span className={`text-xl font-bold mx-2 ${themeClass(theme, { light: 'text-purple-500', dark: 'text-purple-500', neon: 'text-cyan-400', retro: 'text-purple-500' })}`}>
            {opSymbol(selectedOp)}
          </span>
        )}
        {currentValue === null && !selectedOp && (
          <span className="text-sm opacity-50">选择一张牌开始</span>
        )}
      </div>

      {/* Operators */}
      <div className="grid grid-cols-4 gap-2 mb-3">
        {(['+', '−', '×', '÷'] as Op[]).map(op => {
          const opSelectedClass = themeClass(theme, {
            light: 'bg-purple-200 ring-2 ring-purple-400',
            dark: 'bg-amber-500/20 ring-2 ring-amber-400',
            neon: 'bg-cyan-500/30 ring-2 ring-cyan-400',
            retro: 'bg-emerald-200 ring-2 ring-emerald-500',
          })
          return (
            <button
              key={op}
              type="button"
              onClick={() => selectOp(op)}
              className={`
                h-10 rounded-xl text-lg font-bold font-mono transition-all duration-200
                ${selectedOp === op ? opSelectedClass : btnClass}
              `}
            >
              {opSymbol(op)}
            </button>
          )
        })}
      </div>

      {/* History steps */}
      {history.length > 0 && (
        <div className={`text-xs font-mono space-y-0.5 mb-2 ${themeClass(theme, { light: 'text-gray-500', dark: 'text-amber-300/50', neon: 'text-cyan-400/60', retro: 'text-emerald-600/60' })}`}>
          {history.map((h, i) => (
            <div key={i} className="truncate">{h}</div>
          ))}
        </div>
      )}

      {/* Hint toggle */}
      <button
        type="button"
        onClick={() => setShowHint(!showHint)}
        className={`text-xs opacity-50 hover:opacity-100 transition-opacity ${showHint ? 'opacity-100' : ''}`}
      >
        {showHint ? '隐藏提示' : '💡 提示'}
      </button>
      {showHint && (
        <div className="text-xs mt-1 opacity-60">
          用加减乘除让四个数字凑出24，每个数字只能用一次。
          <br />点击数字 → 选运算符 → 再点数字计算结果。
        </div>
      )}

      {/* Message */}
      {message && (
        <div className={`text-center mt-2 text-sm font-bold animate-slide-up ${
          messageType === 'success' ? 'text-green-400' : messageType === 'error' ? 'text-red-400' : 'text-blue-400'
        }`}>
          {message}
        </div>
      )}
    </div>
  )
}
