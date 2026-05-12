export interface HistoryItem {
  id: string
  expression: string
  result: string
  timestamp: number
}

export interface CalculatorState {
  displayValue: string
  previousValue: number | null
  operator: string | null
  waitingForOperand: boolean
  expression: string
  history: HistoryItem[]
  memory: number
}

export type CalculatorAction =
  | { type: 'INPUT_DIGIT'; digit: string }
  | { type: 'INPUT_DECIMAL' }
  | { type: 'INPUT_OPERATOR'; operator: string }
  | { type: 'CLEAR' }
  | { type: 'CLEAR_ENTRY' }
  | { type: 'BACKSPACE' }
  | { type: 'EVALUATE' }
  | { type: 'TOGGLE_SIGN' }
  | { type: 'PERCENT' }
  | { type: 'SCIENTIFIC'; func: string }
  | { type: 'CLEAR_HISTORY' }
  | { type: 'SELECT_HISTORY'; item: HistoryItem }

function evaluate(a: number, b: number, op: string): number {
  switch (op) {
    case '+': return a + b
    case '−': return a - b
    case '×': return a * b
    case '÷': return b !== 0 ? a / b : NaN
    case '^': return Math.pow(a, b)
    default: return b
  }
}

function formatResult(value: number): string {
  if (isNaN(value)) return '错误'
  if (!isFinite(value)) return '无穷大'
  // Avoid floating point precision issues
  const fixed = parseFloat(value.toPrecision(12))
  const str = String(fixed)
  // Limit display length
  if (str.length > 16) {
    return fixed.toExponential(8)
  }
  return str
}

function applyScientific(func: string, value: number): number {
  const deg2rad = Math.PI / 180
  switch (func) {
    case 'sin': return Math.sin(value * deg2rad)
    case 'cos': return Math.cos(value * deg2rad)
    case 'tan': return Math.tan(value * deg2rad)
    case 'asin': return Math.asin(value) / deg2rad
    case 'acos': return Math.acos(value) / deg2rad
    case 'atan': return Math.atan(value) / deg2rad
    case 'log': return Math.log10(value)
    case 'ln': return Math.log(value)
    case '√': return Math.sqrt(value)
    case 'x²': return value * value
    case '!': {
      if (value < 0 || !Number.isInteger(value)) return NaN
      let r = 1
      for (let i = 2; i <= value; i++) r *= i
      return r
    }
    case '1/x': return value !== 0 ? 1 / value : NaN
    case '|x|': return Math.abs(value)
    default: return value
  }
}

export const initialState: CalculatorState = {
  displayValue: '0',
  previousValue: null,
  operator: null,
  waitingForOperand: false,
  expression: '',
  history: [],
  memory: 0,
}

export function calculatorReducer(state: CalculatorState, action: CalculatorAction): CalculatorState {
  switch (action.type) {
    case 'INPUT_DIGIT': {
      const { digit } = action
      if (state.waitingForOperand) {
        return {
          ...state,
          displayValue: digit,
          waitingForOperand: false,
          expression: state.expression + digit,
        }
      }
      // Avoid leading zeros
      const newDisplay = state.displayValue === '0'
        ? digit
        : state.displayValue + digit
      return {
        ...state,
        displayValue: newDisplay,
        expression: state.displayValue === '0'
          ? (state.expression || '0').replace(/0$/, '') + digit
          : state.expression + digit,
      }
    }

    case 'INPUT_DECIMAL': {
      if (state.waitingForOperand) {
        return {
          ...state,
          displayValue: '0.',
          waitingForOperand: false,
          expression: state.expression + '0.',
        }
      }
      if (state.displayValue.includes('.')) return state
      return {
        ...state,
        displayValue: state.displayValue + '.',
        expression: state.expression + '.',
      }
    }

    case 'INPUT_OPERATOR': {
      const { operator: op } = action
      // Handle consecutive operators (replace last operator)
      if (state.operator && state.waitingForOperand) {
        return {
          ...state,
          operator: op,
          expression: state.expression.slice(0, -1) + op,
        }
      }

      const currentValue = parseFloat(state.displayValue)

      if (state.previousValue !== null && state.operator && !state.waitingForOperand) {
        const result = evaluate(state.previousValue, currentValue, state.operator)
        return {
          ...state,
          displayValue: formatResult(result),
          previousValue: result,
          operator: op,
          waitingForOperand: true,
          expression: formatResult(result) + op,
        }
      }

      return {
        ...state,
        previousValue: currentValue,
        operator: op,
        waitingForOperand: true,
        expression: state.expression + op,
      }
    }

    case 'EVALUATE': {
      const currentValue = parseFloat(state.displayValue)
      if (state.previousValue === null || state.operator === null) {
        return state
      }
      const result = evaluate(state.previousValue, currentValue, state.operator)
      const expr = `${state.previousValue} ${state.operator} ${currentValue}`
      const histItem: HistoryItem = {
        id: Date.now().toString(),
        expression: expr,
        result: formatResult(result),
        timestamp: Date.now(),
      }
      return {
        ...state,
        displayValue: formatResult(result),
        previousValue: null,
        operator: null,
        waitingForOperand: false,
        expression: '',
        history: [histItem, ...state.history].slice(0, 50),
      }
    }

    case 'CLEAR':
      return { ...initialState, history: state.history, memory: state.memory }

    case 'CLEAR_ENTRY':
      return {
        ...state,
        displayValue: '0',
        waitingForOperand: false,
      }

    case 'BACKSPACE': {
      if (state.waitingForOperand) return state
      const newDisplay = state.displayValue.length <= 1
        ? '0'
        : state.displayValue.slice(0, -1)
      return {
        ...state,
        displayValue: newDisplay,
        expression: state.expression.slice(0, -1),
      }
    }

    case 'TOGGLE_SIGN': {
      const current = parseFloat(state.displayValue)
      if (current === 0) return state
      return {
        ...state,
        displayValue: formatResult(-current),
      }
    }

    case 'PERCENT': {
      const current = parseFloat(state.displayValue)
      return {
        ...state,
        displayValue: formatResult(current / 100),
      }
    }

    case 'SCIENTIFIC': {
      const current = parseFloat(state.displayValue)
      const result = applyScientific(action.func, current)
      return {
        ...state,
        displayValue: formatResult(result),
        waitingForOperand: true,
      }
    }

    case 'CLEAR_HISTORY':
      return { ...state, history: [] }

    case 'SELECT_HISTORY': {
      const val = parseFloat(action.item.result)
      return {
        ...state,
        displayValue: formatResult(isNaN(val) ? parseFloat(action.item.expression) : val),
        waitingForOperand: false,
      }
    }

    default:
      return state
  }
}
