import { useEffect, useState, useCallback, useRef } from 'react'

interface EmojiParticle {
  id: number
  emoji: string
  x: number
  y: number
  rotation: number
  scale: number
  duration: number
  delay: number
}

// Special result values that trigger easter eggs
const EASTER_EGG_MAP: Record<string, { title: string; emojis: string[]; message: string }> = {
  '42': {
    title: '🐬 生命、宇宙和万物的答案！',
    emojis: ['🐬', '🌌', '✨', '🪐', '🚀'],
    message: "Don't Panic! — 《银河系漫游指南》",
  },
  '69': {
    title: '😏 Nice!',
    emojis: ['😏', '👌', '🔥', '💯'],
    message: 'Nice.',
  },
  '520': {
    title: '💕 520！',
    emojis: ['💕', '💖', '💗', '💝', '🌸', '🫶'],
    message: '我爱你 ❤️',
  },
  '1314': {
    title: '💍 一生一世！',
    emojis: ['💍', '💒', '💝', '🎊', '✨', '🥂'],
    message: '一生一世一双人 💑',
  },
  '3.14159': {
    title: '🥧 π 派！',
    emojis: ['🥧', '📐', '🔢', '🍰'],
    message: 'π ≈ 3.1415926535...',
  },
  '2.71828': {
    title: '📈 e！自然常数',
    emojis: ['📈', '📊', '🔢', '♾️'],
    message: 'e ≈ 2.7182818284...',
  },
  '666': {
    title: '😈',
    emojis: ['😈', '🔥', '💀', '👿'],
    message: 'The Number of the Beast 🤘',
  },
  '888': {
    title: '💰 发发发！',
    emojis: ['💰', '🧧', '🏮', '🎉', '🀄'],
    message: '恭喜发财！',
  },
  '404': {
    title: '🔍 404 Not Found',
    emojis: ['🔍', '❓', '🤷', '📄'],
    message: '这个结果...找不到了？',
  },
}

interface EasterEggProps {
  displayValue: string
}

export default function EasterEgg({ displayValue }: EasterEggProps) {
  const [particles, setParticles] = useState<EmojiParticle[]>([])
  const [showOverlay, setShowOverlay] = useState(false)
  const [overlayData, setOverlayData] = useState<typeof EASTER_EGG_MAP[string] | null>(null)
  const idRef = useRef(0)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isFirstRender = useRef(true)

  const checkEasterEgg = useCallback((value: string) => {
    // Skip initial mount
    if (isFirstRender.current) {
      isFirstRender.current = false
      return null
    }
    // Only trigger for non-trivial values (not empty/0 on empty state)
    if (value === '0') return null

    // Try exact match first, then normalized match
    const normalized = value.replace(/[,\s]/g, '')
    const num = parseFloat(normalized)

    // Exact match
    if (EASTER_EGG_MAP[value]) {
      return EASTER_EGG_MAP[value]
    }
    if (EASTER_EGG_MAP[normalized]) {
      return EASTER_EGG_MAP[normalized]
    }

    // Near-match for π
    if (Math.abs(num - Math.PI) < 0.0001 && value.length >= 5) {
      return EASTER_EGG_MAP['3.14159']
    }
    // Near-match for e
    if (Math.abs(num - Math.E) < 0.0001 && value.length >= 5) {
      return EASTER_EGG_MAP['2.71828']
    }

    return null
  }, [])

  useEffect(() => {
    const data = checkEasterEgg(displayValue)
    if (!data) return

    // Show overlay
    setOverlayData(data)
    setShowOverlay(true)

    // Spawn emoji particles
    const newParticles: EmojiParticle[] = []
    const count = data.emojis.length * 4
    for (let i = 0; i < count; i++) {
      newParticles.push({
        id: idRef.current++,
        emoji: data.emojis[Math.floor(Math.random() * data.emojis.length)],
        x: Math.random() * 100,
        y: -10 - Math.random() * 20,
        rotation: (Math.random() - 0.5) * 720,
        scale: 0.8 + Math.random() * 1.2,
        duration: 2 + Math.random() * 3,
        delay: Math.random() * 0.5,
      })
    }
    setParticles(newParticles)

    // Auto-dismiss overlay
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => {
      setShowOverlay(false)
      setParticles([])
    }, 3500)

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [displayValue, checkEasterEgg])

  if (!showOverlay && particles.length === 0) return null

  return (
    <>
      {/* Emoji particle rain */}
      {particles.map((p) => (
        <span
          key={p.id}
          className="pointer-events-none fixed z-[100] select-none"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            fontSize: `${1.5 * p.scale}rem`,
            animation: `easter-egg-fall ${p.duration}s ease-in ${p.delay}s forwards`,
            transform: `rotate(${p.rotation}deg)`,
          }}
        >
          {p.emoji}
        </span>
      ))}

      {/* Overlay message */}
      {showOverlay && overlayData && (
        <div
          className={`
            fixed inset-0 z-[90] flex items-center justify-center
            pointer-events-none select-none
            animate-easter-overlay
          `}
        >
          <div
            className={`
              text-center px-8 py-6 rounded-3xl
              backdrop-blur-xl
              bg-white/20 dark:bg-black/30
              border border-white/30 dark:border-white/10
              shadow-2xl
              animate-easter-pop
            `}
          >
            <div className="text-4xl mb-3 animate-bounce">
              {overlayData.emojis[0]}
            </div>
            <h2 className="text-xl font-bold text-white dark:text-white mb-1 font-display drop-shadow-lg">
              {overlayData.title}
            </h2>
            <p className="text-sm text-white/80 dark:text-white/70 font-medium">
              {overlayData.message}
            </p>
          </div>
        </div>
      )}
    </>
  )
}
