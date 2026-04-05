import React, { createContext, useContext, useState, useEffect } from 'react'
import { getStoredTheme, saveTheme } from './api'

const ThemeCtx = createContext()

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getStoredTheme)

  // Sync body class so index.html color-scheme rules apply to native controls
  useEffect(() => {
    document.body.classList.remove('theme-dark', 'theme-light')
    document.body.classList.add(theme === 'dark' ? 'theme-dark' : 'theme-light')
  }, [theme])

  const toggle = () => setTheme(t => {
    const next = t === 'dark' ? 'light' : 'dark'
    saveTheme(next)
    return next
  })

  return (
    <ThemeCtx.Provider value={{ theme, toggle, isDark: theme === 'dark' }}>
      {children}
    </ThemeCtx.Provider>
  )
}

export const useTheme = () => useContext(ThemeCtx)

export function tokens(isDark) {
  return {
    bg:          isDark ? '#080c14'                    : '#f4f6fb',
    bgCard:      isDark ? 'rgba(255,255,255,0.03)'     : 'rgba(0,0,0,0.03)',
    bgCard2:     isDark ? 'rgba(255,255,255,0.06)'     : 'rgba(0,0,0,0.06)',
    border:      isDark ? 'rgba(255,255,255,0.07)'     : 'rgba(0,0,0,0.09)',
    borderMid:   isDark ? 'rgba(255,255,255,0.1)'      : 'rgba(0,0,0,0.12)',
    header:      isDark ? 'rgba(8,12,20,0.92)'         : 'rgba(244,246,251,0.92)',
    text:        isDark ? '#ffffff'                    : '#0f172a',
    textMuted:   isDark ? 'rgba(255,255,255,0.38)'     : 'rgba(15,23,42,0.5)',
    textFaint:   isDark ? 'rgba(255,255,255,0.2)'      : 'rgba(15,23,42,0.3)',
    inputBg:     isDark ? 'rgba(255,255,255,0.07)'     : '#f1f5f9',
    rowHover:    isDark ? 'rgba(255,255,255,0.025)'    : 'rgba(0,0,0,0.025)',
    accentIncome:  '#10b981',
    accentExpense: '#f43f5e',
    accentPrimary: '#6366f1',
    inputSolid:  isDark ? '#1a2035' : '#f1f5f9',
    inputColor:  isDark ? '#ffffff' : '#0f172a',
  }
}
