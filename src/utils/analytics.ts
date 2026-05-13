// Google Analytics 事件追踪工具
// 使用前：将 index.html 中的 G-XXXXXXXXXX 替换为你的 Google Analytics 衡量ID

type GtagFn = (command: string, action: string, params?: Record<string, unknown>) => void

function getGtag(): GtagFn | null {
  if (typeof window !== 'undefined' && 'gtag' in window) {
    return (window as unknown as Record<string, GtagFn>).gtag
  }
  return null
}

export function trackEvent(action: string, params?: Record<string, unknown>) {
  const gtag = getGtag()
  if (gtag) {
    gtag('event', action, params)
  }
}

// 预设事件
export const Analytics = {
  /** 计算器按键 */
  buttonClick(label: string) {
    trackEvent('button_click', { event_label: label, event_category: 'calculator' })
  },

  /** 计算结果 */
  calculation(expression: string, result: string) {
    trackEvent('calculation', {
      event_label: expression,
      event_category: 'calculator',
      value: result,
    })
  },

  /** 切换主题 */
  themeChange(theme: string) {
    trackEvent('theme_change', { event_label: theme, event_category: 'settings' })
  },

  /** 切换语言 */
  languageChange(lang: string) {
    trackEvent('language_change', { event_label: lang, event_category: 'settings' })
  },

  /** 进入游戏模式 */
  gameModeEnter(mode: string) {
    trackEvent('game_mode_enter', { event_label: mode, event_category: 'game' })
  },

  /** 游戏完成 */
  gameModeComplete(mode: string, score: number) {
    trackEvent('game_mode_complete', { event_label: mode, event_category: 'game', value: score })
  },
}
