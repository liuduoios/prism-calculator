import { useTheme } from '../context/ThemeContext'
import { useTranslation } from '../context/LanguageContext'
import type { HistoryItem } from '../reducer/calculatorReducer'

interface HistoryProps {
  history: HistoryItem[]
  onSelect: (item: HistoryItem) => void
  onClear: () => void
}

export default function History({ history, onSelect, onClear }: HistoryProps) {
  const { theme } = useTheme()
  const { t } = useTranslation()

  const emptyTextClass = theme === 'neon'
    ? 'text-cyan-500/50'
    : theme === 'retro'
      ? 'text-emerald-600/50'
      : theme === 'light'
        ? 'text-gray-400'
        : 'text-gray-500'

  const titleClass = theme === 'neon'
    ? 'text-cyan-300'
    : theme === 'retro'
      ? 'text-emerald-700'
      : theme === 'light'
        ? 'text-gray-600'
        : 'text-gray-300'

  const exprClass = theme === 'neon'
    ? 'text-cyan-400/60'
    : theme === 'retro'
      ? 'text-emerald-600/50'
      : theme === 'light'
        ? 'text-gray-400'
        : 'text-gray-500'

  const resultClass = theme === 'neon'
    ? 'text-cyan-200'
    : theme === 'retro'
      ? 'text-emerald-900'
      : theme === 'light'
        ? 'text-gray-800'
        : 'text-white'

  const emptyDisplayClass = theme === 'neon'
    ? 'glass-display-neon'
    : theme === 'retro'
      ? 'glass-display-retro'
      : theme === 'light'
        ? 'glass-display-light'
        : 'glass-display-dark'

  const btnVariant = theme === 'neon'
    ? 'glass-btn-function-neon'
    : theme === 'retro'
      ? 'glass-btn-function-retro'
      : theme === 'light'
        ? 'glass-btn-function-light'
        : 'glass-btn-function-dark'

  const numVariant = theme === 'neon'
    ? 'glass-btn-number-neon'
    : theme === 'retro'
      ? 'glass-btn-number-retro'
      : theme === 'light'
        ? 'glass-btn-number-light'
        : 'glass-btn-number-dark'

  if (history.length === 0) {
    return (
      <div className={`
        flex-1 flex items-center justify-center
        rounded-2xl text-center text-sm
        glass-display
        ${emptyDisplayClass}
        ${emptyTextClass}
      `}>
        <div className="flex flex-col items-center gap-2 py-8">
          <span className="text-2xl">📝</span>
          <span className="font-medium">{t('history.empty')}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4 px-1">
        <h3 className={`text-sm font-semibold tracking-wide flex items-center gap-2 ${titleClass}`}>
          <span>📋</span>
          <span>{t('history.title')}</span>
        </h3>
        <button
          type="button"
          onClick={onClear}
          className={`
            text-xs px-3 py-1.5 rounded-xl font-medium
            transition-all duration-200
            glass-btn
            ${btnVariant}
            hover:!text-red-500 hover:!border-red-300/40
          `}
        >
          {t('history.clear')}
        </button>
      </div>

      <div className="overflow-y-auto flex-1 space-y-2.5 pr-1 min-h-0">
        {history.map((item, index) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelect(item)}
            className={`
              w-full text-left p-3.5 rounded-xl
              transition-all duration-200
              glass-btn
              ${numVariant}
              hover:scale-[1.02]
              history-item
            `}
            style={{ animationDelay: `${index * 30}ms` }}
          >
            <div className={`text-xs font-mono truncate mb-1.5 ${exprClass}`}>
              {item.expression}
            </div>
            <div className={`text-lg font-bold font-mono text-right tracking-tight ${resultClass}`}>
              {item.result}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
