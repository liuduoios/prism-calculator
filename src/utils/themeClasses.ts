import type { Theme } from '../context/ThemeContext'

/**
 * Core utility: maps a Theme to a CSS class string.
 *
 * Usage:
 *   themeClass(theme, { light: 'text-gray-800', dark: 'text-white', neon: 'text-cyan-300', retro: 'text-emerald-900' })
 *
 * Falls back to `light` value if a key is missing for the current theme.
 */
export function themeClass<T extends string>(
  theme: Theme,
  map: Partial<Record<Theme, T>> & Record<string, T>,
): T {
  return map[theme] ?? map.light ?? '' as T
}

// ─── Pre-built theme maps (used across all components) ───

export const BG_GRADIENT: Record<Theme, string> = {
  light: 'bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50',
  dark: 'bg-gradient-to-br from-gray-950 via-slate-900 to-gray-900',
  neon: 'bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950',
  retro: 'bg-gradient-to-br from-amber-50 via-emerald-50 to-teal-50',
}

export const HEADER_BG: Record<Theme, string> = {
  light: 'bg-white/40 backdrop-blur-md border-b border-white/40',
  dark: 'bg-gray-900/40 backdrop-blur-md border-b border-white/5',
  neon: 'bg-black/60 backdrop-blur-md border-b border-cyan-500/20',
  retro: 'bg-amber-100/60 backdrop-blur-md border-b border-amber-300/40',
}

export const HEADER_TEXT: Record<Theme, string> = {
  light: 'text-gray-800',
  dark: 'text-white',
  neon: 'text-cyan-300',
  retro: 'text-emerald-900',
}

export const FOOTER_TEXT: Record<Theme, string> = {
  light: 'text-purple-300/70',
  dark: 'text-gray-600',
  neon: 'text-cyan-500/50',
  retro: 'text-emerald-600/60',
}

export const GLASS_CARD: Record<Theme, string> = {
  light: 'glass-card-light',
  dark: 'glass-card-dark',
  neon: 'glass-card-neon',
  retro: 'glass-card-retro',
}

export const GLASS_CARD_SHADOW: Record<Theme, string> = {
  light: 'hover:shadow-[0_12px_40px_rgba(0,0,0,0.12)]',
  dark: 'hover:shadow-[0_12px_40px_rgba(0,0,0,0.12)]',
  neon: 'shadow-[0_0_30px_rgba(6,182,212,0.3)]',
  retro: 'hover:shadow-[0_12px_40px_rgba(0,0,0,0.12)]',
}

export const GLASS_DISPLAY: Record<Theme, string> = {
  light: 'glass-display-light',
  dark: 'glass-display-dark',
  neon: 'glass-display-neon',
  retro: 'glass-display-retro',
}

export const DISPLAY_TEXT: Record<Theme, string> = {
  light: 'text-gray-900',
  dark: 'text-white',
  neon: 'text-cyan-300',
  retro: 'text-emerald-900',
}

export const EXPRESSION_TEXT: Record<Theme, string> = {
  light: 'text-gray-400/80',
  dark: 'text-gray-500/70',
  neon: 'text-cyan-400/60',
  retro: 'text-emerald-600/60',
}

export const EMPTY_TEXT: Record<Theme, string> = {
  light: 'text-gray-400',
  dark: 'text-gray-500',
  neon: 'text-cyan-500/50',
  retro: 'text-emerald-600/50',
}

export const TITLE_TEXT: Record<Theme, string> = {
  light: 'text-gray-600',
  dark: 'text-gray-300',
  neon: 'text-cyan-300',
  retro: 'text-emerald-700',
}

export const HISTORY_EXPR_TEXT: Record<Theme, string> = {
  light: 'text-gray-400',
  dark: 'text-gray-500',
  neon: 'text-cyan-400/60',
  retro: 'text-emerald-600/50',
}

export const HISTORY_RESULT_TEXT: Record<Theme, string> = {
  light: 'text-gray-800',
  dark: 'text-white',
  neon: 'text-cyan-200',
  retro: 'text-emerald-900',
}

export const LABEL_TEXT: Record<Theme, string> = {
  light: 'text-gray-400',
  dark: 'text-gray-500',
  neon: 'text-cyan-500/60',
  retro: 'text-emerald-600/50',
}

/** Sidebar section labels like "游戏模式" / "工具" */
export const SIDEBAR_LABEL_TEXT: Record<Theme, string> = {
  light: 'text-gray-400',
  dark: 'text-gray-300',
  neon: 'text-cyan-300/40',
  retro: 'text-emerald-600/60',
}

export const BASE_TEXT: Record<Theme, string> = {
  light: 'text-gray-800',
  dark: 'text-gray-300',
  neon: 'text-cyan-300',
  retro: 'text-emerald-900',
}

export const BTN_NUMBER: Record<Theme, string> = {
  light: 'glass-btn-number-light',
  dark: 'glass-btn-number-dark',
  neon: 'glass-btn-number-neon',
  retro: 'glass-btn-number-retro',
}

export const BTN_OPERATOR: Record<Theme, string> = {
  light: 'glass-btn-operator-light',
  dark: 'glass-btn-operator-dark',
  neon: 'glass-btn-operator-neon',
  retro: 'glass-btn-operator-retro',
}

export const BTN_FUNCTION: Record<Theme, string> = {
  light: 'glass-btn-function-light',
  dark: 'glass-btn-function-dark',
  neon: 'glass-btn-function-neon',
  retro: 'glass-btn-function-retro',
}

export const BTN_EQUALS: Record<Theme, string> = {
  light: 'glass-btn-equals-light',
  dark: 'glass-btn-equals-dark',
  neon: 'glass-btn-equals-neon',
  retro: 'glass-btn-equals-retro',
}

export const BTN_CLEAR: Record<Theme, string> = {
  light: 'glass-btn-clear-light',
  dark: 'glass-btn-clear-dark',
  neon: 'glass-btn-clear-neon',
  retro: 'glass-btn-clear-retro',
}

export const BTN_SCI: Record<Theme, string> = {
  light: 'glass-btn-sci-light',
  dark: 'glass-btn-sci-dark',
  neon: 'glass-btn-sci-neon',
  retro: 'glass-btn-sci-retro',
}

/** Amber variant — used in App.tsx game buttons (dark theme only) */
export const BTN_AMBER_DARK = 'glass-btn amber-btn-dark'

export const DIVIDER: Record<Theme, string> = {
  light: 'bg-black/8',
  dark: 'bg-white/8',
  neon: 'bg-white/8',
  retro: 'bg-black/8',
}

export const ACCENT_BG: Record<Theme, string> = {
  light: '!bg-purple-100/60 !border-purple-300/40 !text-purple-600',
  dark: '!bg-purple-500/10 !border-purple-400/20 !text-purple-400',
  neon: '!bg-purple-500/10 !border-purple-400/20 !text-purple-400',
  retro: '!bg-purple-100/60 !border-purple-300/40 !text-purple-600',
}

/** Default text color for game-mode content areas (ChallengeMode, 24-Game etc.) */
export const GAME_CONTENT_TEXT: Record<Theme, string> = {
  light: 'text-gray-700',
  dark: 'text-gray-200',
  neon: 'text-cyan-100',
  retro: 'text-emerald-800',
}
