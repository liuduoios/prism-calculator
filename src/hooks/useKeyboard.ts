import { useEffect } from 'react'
import type { CalculatorAction } from '../reducer/calculatorReducer'

export function useKeyboard(dispatch: React.Dispatch<CalculatorAction>) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Prevent default for keys we handle
      const handledKeys = [
        '0','1','2','3','4','5','6','7','8','9',
        '+', '-', '*', '/', '.', ',',
        'Enter', '=', 'Escape', 'Backspace', 'Delete',
        '%', '^',
      ]

      // If user is inside an input/textarea, ignore
      const tag = (e.target as HTMLElement).tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return

      if (handledKeys.includes(e.key)) {
        e.preventDefault()
      }

      switch (e.key) {
        case '0': case '1': case '2': case '3': case '4':
        case '5': case '6': case '7': case '8': case '9':
          dispatch({ type: 'INPUT_DIGIT', digit: e.key })
          break

        case '+':
          dispatch({ type: 'INPUT_OPERATOR', operator: '+' })
          break

        case '-':
          dispatch({ type: 'INPUT_OPERATOR', operator: '−' })
          break

        case '*':
          dispatch({ type: 'INPUT_OPERATOR', operator: '×' })
          break

        case '/':
          dispatch({ type: 'INPUT_OPERATOR', operator: '÷' })
          break

        case '.':
        case ',':
          dispatch({ type: 'INPUT_DECIMAL' })
          break

        case 'Enter':
        case '=':
          dispatch({ type: 'EVALUATE' })
          break

        case 'Escape':
        case 'Delete':
          dispatch({ type: 'CLEAR' })
          break

        case 'Backspace':
          dispatch({ type: 'BACKSPACE' })
          break

        case '%':
          dispatch({ type: 'PERCENT' })
          break

        case '^':
          dispatch({ type: 'INPUT_OPERATOR', operator: '^' })
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [dispatch])
}
