// 事件追踪工具 —— 同时上报到 Google Analytics 和 CyanCode Analytics。
//
// GA4 暂时保留并行跑一段,用来交叉验证新埋点的数字:
// 两边对得上,说明自建埋点没被广告拦截器吃掉太多;差异大就值得排查。
// 稳定之后可以把 GA 那一路去掉。

type GtagFn = (command: string, action: string, params?: Record<string, unknown>) => void

/** CyanCode Analytics 的全局接口,由 /t.js 注入 */
type CyanTrackFn = (name: string, props?: Record<string, unknown>) => void

function getGtag(): GtagFn | null {
  if (typeof window !== 'undefined' && 'gtag' in window) {
    return (window as unknown as Record<string, GtagFn>).gtag
  }
  return null
}

function getCyanTrack(): CyanTrackFn | null {
  if (typeof window !== 'undefined' && '__n' in window) {
    return (window as unknown as Record<string, CyanTrackFn>).__n
  }
  return null
}

export function trackEvent(action: string, params?: Record<string, unknown>) {
  // ── Google Analytics ──────────────────────────────
  const gtag = getGtag()
  if (gtag) {
    gtag('event', action, params)
  }

  // ── CyanCode Analytics ────────────────────────────
  // ⚠️ 参数名做转换:event_label / event_category 是 GA4 的专有命名,
  //    自建看板用更中性的 label / category,避免将来脱离 GA 时
  //    还要回头改数据口径。
  const track = getCyanTrack()
  if (track) {
    track(action, {
      label: params?.event_label,
      category: params?.event_category,
      value: params?.value,
    })
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
