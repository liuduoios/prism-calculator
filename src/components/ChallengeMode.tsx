import { useState, useCallback, useEffect, useRef } from 'react'
import { useTheme } from '../context/ThemeContext'

interface ChallengeStats {
  score: number
  streak: number
  bestStreak: number
  totalCorrect: number
  totalWrong: number
  level: number
}

interface Question {
  a: number
  b: number
  op: string
  answer: number
  displayOp: string
}

const OP_TABLE: Record<string, { fn: (a: number, b: number) => number; display: string }> = {
  '+': { fn: (a, b) => a + b, display: '+' },
  '−': { fn: (a, b) => a - b, display: '−' },
  '×': { fn: (a, b) => a * b, display: '×' },
}

function generateQuestion(level: number): Question {
  const max = Math.min(10 + level * 5, 999)
  const a = Math.floor(Math.random() * max)
  const b = Math.floor(Math.random() * Math.min(max, a + 10))
  const ops = level <= 2 ? ['+', '−'] : ['+', '−', '×']
  const op = ops[Math.floor(Math.random() * ops.length)]
  const { fn, display } = OP_TABLE[op]
  return { a, b, op, answer: fn(a, b), displayOp: display }
}

function getInitialStats(): ChallengeStats {
  try {
    const stored = localStorage.getItem('calc-challenge-stats')
    if (stored) return JSON.parse(stored)
  } catch {}
  return { score: 0, streak: 0, bestStreak: 0, totalCorrect: 0, totalWrong: 0, level: 1 }
}

export default function ChallengeMode() {
  const { theme } = useTheme()
  const [active, setActive] = useState(false)
  const [question, setQuestion] = useState<Question | null>(null)
  const [input, setInput] = useState('')
  const [stats, setStats] = useState<ChallengeStats>(getInitialStats)
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null)
  const [timeLeft, setTimeLeft] = useState(10)
  const [showResult, setShowResult] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const feedbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const isNeon = theme === 'neon'
  const isRetro = theme === 'retro'
  const isLightLike = theme === 'light' || theme === 'retro'

  const saveStats = useCallback((s: ChallengeStats) => {
    localStorage.setItem('calc-challenge-stats', JSON.stringify(s))
  }, [])

  const nextQuestion = useCallback((currentStats: ChallengeStats) => {
    const q = generateQuestion(currentStats.level)
    setQuestion(q)
    setInput('')
    setTimeLeft(Math.max(5, 10 - Math.floor(currentStats.level / 2)))
    setFeedback(null)
    setTimeout(() => inputRef.current?.focus(), 50)
  }, [])

  const startGame = useCallback(() => {
    const initial = getInitialStats()
    setStats(initial)
    setActive(true)
    setShowResult(false)
    nextQuestion(initial)
  }, [nextQuestion])

  const endGame = useCallback(() => {
    setActive(false)
    setQuestion(null)
    setShowResult(true)
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [])

  // Timer
  useEffect(() => {
    if (!active) return

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          // Time's up
          setStats(s => {
            const updated = {
              ...s,
              streak: 0,
              totalWrong: s.totalWrong + 1,
            }
            saveStats(updated)
            if (updated.totalWrong >= 3) {
              setTimeout(() => endGame(), 100)
            } else {
              setTimeout(() => nextQuestion(updated), 100)
            }
            return updated
          })
          return 10
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [active, endGame, nextQuestion, saveStats])

  const handleSubmit = useCallback(() => {
    if (!question || !active) return

    const userAnswer = parseFloat(input)
    if (isNaN(userAnswer)) return

    const correct = Math.abs(userAnswer - question.answer) < 0.001

    if (correct) {
      setFeedback('correct')
      setStats(s => {
        const newStreak = s.streak + 1
        const newLevel = newStreak >= s.level * 5 ? s.level + 1 : s.level
        const updated: ChallengeStats = {
          score: s.score + 10 + s.level * 2,
          streak: newStreak,
          bestStreak: Math.max(s.bestStreak, newStreak),
          totalCorrect: s.totalCorrect + 1,
          totalWrong: s.totalWrong,
          level: newLevel,
        }
        saveStats(updated)
        setTimeout(() => nextQuestion(updated), 600)
        return updated
      })
    } else {
      setFeedback('wrong')
      setStats(s => {
        const updated = {
          ...s,
          streak: 0,
          totalWrong: s.totalWrong + 1,
        }
        saveStats(updated)
        if (updated.totalWrong >= 3) {
          setTimeout(() => endGame(), 800)
        } else {
          setTimeout(() => nextQuestion(updated), 800)
        }
        return updated
      })
    }

    if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current)
    feedbackTimerRef.current = setTimeout(() => setFeedback(null), 500)
  }, [question, input, active, endGame, nextQuestion, saveStats])

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit()
    }
  }, [handleSubmit])

  const btnClass = isNeon
    ? 'glass-btn-function-neon'
    : isRetro
      ? 'glass-btn-function-retro'
      : isLightLike
        ? 'glass-btn-function-light'
        : 'glass-btn-function-dark'

  const accentColor = isNeon ? 'text-cyan-300' : isRetro ? 'text-emerald-600' : isLightLike ? 'text-purple-600' : 'text-purple-400'
  const bgAccent = isNeon ? 'bg-cyan-500/10' : isRetro ? 'bg-emerald-100' : isLightLike ? 'bg-purple-50' : 'bg-purple-500/10'

  if (!active && !showResult) {
    return (
      <div className="mb-4">
        <button
          type="button"
          onClick={startGame}
          className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-full text-sm font-semibold tracking-wider transition-all duration-300 glass-btn ${btnClass}`}
        >
          <span>🏆</span>
          <span>口算挑战模式</span>
          <span className="text-xs opacity-60">Beta</span>
        </button>
      </div>
    )
  }

  if (showResult) {
    return (
      <div className={`mb-4 rounded-2xl p-5 text-center ${bgAccent} border border-white/10`}>
        <div className="text-3xl mb-2">🏆</div>
        <h3 className={`font-bold text-lg mb-1 ${accentColor}`}>挑战结束！</h3>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs mt-3">
          <span className="text-right opacity-60">得分</span>
          <span className={`text-left font-bold ${accentColor}`}>{stats.score}</span>
          <span className="text-right opacity-60">最佳连击</span>
          <span className="text-left font-bold">{stats.bestStreak}</span>
          <span className="text-right opacity-60">正确率</span>
          <span className="text-left font-bold">
            {stats.totalCorrect + stats.totalWrong > 0
              ? Math.round((stats.totalCorrect / (stats.totalCorrect + stats.totalWrong)) * 100)
              : 0}%
          </span>
          <span className="text-right opacity-60">等级</span>
          <span className="text-left font-bold">Lv.{stats.level}</span>
        </div>
        <button
          type="button"
          onClick={startGame}
          className={`mt-4 py-2 px-6 rounded-full text-sm font-bold transition-all duration-200 glass-btn ${btnClass}`}
        >
          再来一局
        </button>
      </div>
    )
  }

  if (!question) return null

  return (
    <div className={`mb-4 rounded-2xl p-4 ${bgAccent} border border-white/10 transition-all duration-200 ${feedback === 'correct' ? 'ring-2 ring-green-400' : feedback === 'wrong' ? 'ring-2 ring-red-400 animate-shake' : ''}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3 text-xs">
          <span className="opacity-60">Lv.{stats.level}</span>
          <span className="opacity-60">得分 {stats.score}</span>
          <span className={`font-bold ${stats.streak >= 3 ? accentColor + ' animate-pulse' : ''}`}>
            🔥{stats.streak}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {/* Timer bar */}
          <div className="w-16 h-2 rounded-full bg-white/10 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-1000 ${
                timeLeft > 5 ? 'bg-green-400' : timeLeft > 2 ? 'bg-amber-400' : 'bg-red-400'
              }`}
              style={{ width: `${(timeLeft / 10) * 100}%` }}
            />
          </div>
          <button
            type="button"
            onClick={endGame}
            className="text-xs opacity-50 hover:opacity-100"
          >
            退出
          </button>
        </div>
      </div>

      {/* Question */}
      <div className={`text-center mb-3`}>
        <div className={`text-3xl font-bold font-mono tracking-widest ${accentColor}`}>
          {question.a} <span className="text-2xl">{question.displayOp}</span> {question.b} <span className="text-2xl">=</span> ?
        </div>
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <input
          ref={inputRef}
          type="text"
          inputMode="numeric"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="输入答案..."
          className={`
            flex-1 h-10 px-4 rounded-xl text-center font-mono font-bold text-lg
            outline-none transition-all duration-200
            ${isLightLike
              ? 'bg-white/60 border border-white/60 text-gray-900 placeholder-gray-400 focus:border-purple-400'
              : 'bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-purple-400/50'
            }
          `}
        />
        <button
          type="button"
          onClick={handleSubmit}
          className={`px-5 h-10 rounded-xl font-bold text-sm transition-all duration-200 glass-btn ${btnClass}`}
        >
          确定
        </button>
      </div>

      {/* Feedback animation */}
      {feedback && (
        <div className={`text-center mt-2 text-lg font-bold animate-slide-up ${feedback === 'correct' ? 'text-green-400' : 'text-red-400'}`}>
          {feedback === 'correct' ? '✓ 正确！' : '✗ 再想想'}
        </div>
      )}
    </div>
  )
}
