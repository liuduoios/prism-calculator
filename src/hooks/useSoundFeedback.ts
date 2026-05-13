import { useCallback, useRef } from 'react'
import type { CalculatorAction } from '../reducer/calculatorReducer'

type ButtonType = 'number' | 'operator' | 'function' | 'equals' | 'clear' | 'memory'

const FREQ_MAP: Record<ButtonType, [number, number, number]> = {
  number: [800, 0.06, 0.08],
  operator: [600, 0.08, 0.10],
  function: [500, 0.05, 0.08],
  equals: [1000, 0.1, 0.15],
  clear: [300, 0.08, 0.12],
  memory: [700, 0.05, 0.08],
}

function getButtonType(action: CalculatorAction): ButtonType | null {
  switch (action.type) {
    case 'INPUT_DIGIT':
    case 'INPUT_DECIMAL':
      return 'number'
    case 'INPUT_OPERATOR':
      return 'operator'
    case 'EVALUATE':
      return 'equals'
    case 'CLEAR':
    case 'CLEAR_ENTRY':
    case 'BACKSPACE':
      return 'clear'
    case 'TOGGLE_SIGN':
    case 'PERCENT':
    case 'SCIENTIFIC':
      return 'function'
    case 'MEMORY_ADD':
    case 'MEMORY_SUBTRACT':
    case 'MEMORY_RECALL':
    case 'MEMORY_CLEAR':
      return 'memory'
    default:
      return null
  }
}

export function useSoundFeedback() {
  const ctxRef = useRef<AudioContext | null>(null)

  const getCtx = useCallback(() => {
    if (!ctxRef.current) {
      ctxRef.current = new AudioContext()
    }
    return ctxRef.current
  }, [])

  /**
   * Play a beep sound based on button action type.
   * Uses Web Audio API — no external audio files needed.
   */
  const playSound = useCallback((action: CalculatorAction) => {
    const btnType = getButtonType(action)
    if (!btnType) return

    try {
      const ctx = getCtx()
      const [freq, dur, vol] = FREQ_MAP[btnType]

      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, ctx.currentTime)
      // Slightly change pitch for more natural feel
      osc.frequency.linearRampToValueAtTime(freq * 0.7, ctx.currentTime + dur)

      gain.gain.setValueAtTime(vol, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start(ctx.currentTime)
      osc.stop(ctx.currentTime + dur)
    } catch {
      // AudioContext may not be supported or autoplay blocked — silently ignore
    }
  }, [getCtx])

  /**
   * Trigger haptic feedback on supported mobile devices.
   */
  const vibrate = useCallback((action: CalculatorAction) => {
    if (!('vibrate' in navigator)) return

    const btnType = getButtonType(action)
    if (!btnType) return

    const patterns: Record<ButtonType, number> = {
      number: 10,
      operator: 20,
      function: 15,
      equals: [15, 30, 15] as unknown as number,
      clear: [30, 15, 30] as unknown as number,
      memory: 12,
    }

    try {
      navigator.vibrate(patterns[btnType])
    } catch {
      // Silently ignore
    }
  }, [])

  return { playSound, vibrate }
}
