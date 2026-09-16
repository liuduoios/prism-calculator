import { useTheme } from '../context/ThemeContext'

/**
 * Renders theme-specific background effects:
 * - Floating gradient orbs (light/dark)
 * - Neon scanlines (neon)
 * - Retro grain overlay (retro)
 */
export default function BackgroundEffects() {
  const { theme } = useTheme()

  return (
    <>
      {/* Floating orbs — only light/dark */}
      {(theme === 'light' || theme === 'dark') && (
        <>
          <div className="orb orb-1" />
          <div className="orb orb-2" />
          <div className="orb orb-3" />
          <div className="orb orb-4" />
        </>
      )}

      {/* Neon scanlines */}
      {theme === 'neon' && (
        <div className="fixed inset-0 pointer-events-none z-[1] neon-scanlines" />
      )}

      {/* Retro grain */}
      {theme === 'retro' && (
        <div className="fixed inset-0 pointer-events-none z-[1] retro-grain opacity-30" />
      )}
    </>
  )
}
