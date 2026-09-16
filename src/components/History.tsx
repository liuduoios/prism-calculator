import { useTheme } from '../context/ThemeContext'
import type { HistoryItem } from '../reducer/calculatorReducer'

interface HistoryProps {
  history: HistoryItem[]
  onSelect: (item: HistoryItem) => void
  onClear: () => void
}

export default function History({ history, onSelect, onClear }: HistoryProps) {
  const { theme } = useTheme()

  if (history.length === 0) {
    return (
      <div className={`
        p-4 rounded-2xl text-center text-sm
        transition-colors duration-300
        ${theme === 'light'
          ? 'bg-gray-50 text-gray-400'
          : 'bg-gray-800/50 text-gray-500'
        }
      `}>
        📝 暂无计算历史
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-3 px-1">
        <h3 className={`
          text-sm font-semibold
          ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}
        `}>
          📋 计算历史
        </h3>
        <button
          onClick={onClear}
          className={`
            text-xs px-3 py-1 rounded-lg transition-all duration-150
            ${theme === 'light'
              ? 'bg-gray-200 text-gray-500 hover:bg-red-100 hover:text-red-500'
              : 'bg-gray-700 text-gray-400 hover:bg-red-900/40 hover:text-red-400'
            }
          `}
        >
          清空
        </button>
      </div>

      <div className="overflow-y-auto flex-1 space-y-2 pr-1 min-h-0
        [&::-webkit-scrollbar]:w-1.5
        [&::-webkit-scrollbar-track]:bg-transparent
        [&::-webkit-scrollbar-thumb]:bg-gray-300
        dark:[&::-webkit-scrollbar-thumb]:bg-gray-600
        [&::-webkit-scrollbar-thumb]:rounded-full
      ">
        {history.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelect(item)}
            className={`
              w-full text-left p-3 rounded-xl transition-all duration-150
              hover:scale-[1.02] active:scale-[0.98]
              ${theme === 'light'
                ? 'bg-white hover:bg-gray-100 border border-gray-200'
                : 'bg-gray-800 hover:bg-gray-700 border border-gray-700'
              }
            `}
          >
            <div className={`
              text-xs font-mono truncate mb-1
              ${theme === 'light' ? 'text-gray-400' : 'text-gray-500'}
            `}>
              {item.expression}
            </div>
            <div className={`
              text-lg font-semibold font-mono text-right
              ${theme === 'light' ? 'text-gray-800' : 'text-white'}
            `}>
              {item.result}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
