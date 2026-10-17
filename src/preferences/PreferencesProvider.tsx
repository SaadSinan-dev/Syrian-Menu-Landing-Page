import { useEffect, useRef, useState, type ReactNode } from 'react'
import type { Language } from '../data/menu'
import { PreferencesContext } from './context'
import { preferenceKeys, writePreference, type Theme } from './settings'

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [language, updateLanguage] = useState<Language>(() =>
    document.documentElement.lang === 'ar' ? 'ar' : 'en',
  )
  const [theme, updateTheme] = useState<Theme>(() =>
    document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light',
  )
  const transitionTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  function briefTransition() {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
    document.documentElement.classList.add('preferences-changing')
    clearTimeout(transitionTimer.current)
    transitionTimer.current = setTimeout(
      () => document.documentElement.classList.remove('preferences-changing'),
      280,
    )
  }
  function setLanguage(next: Language) {
    briefTransition()
    document.documentElement.lang = next
    document.documentElement.dir = next === 'ar' ? 'rtl' : 'ltr'
    updateLanguage(next)
    writePreference(preferenceKeys.language, next)
  }
  function setTheme(next: Theme) {
    briefTransition()
    document.documentElement.dataset.theme = next
    document.documentElement.style.colorScheme = next
    updateTheme(next)
    writePreference(preferenceKeys.theme, next)
  }
  useEffect(() => {
    return () => {
      clearTimeout(transitionTimer.current)
    }
  }, [])
  return (
    <PreferencesContext value={{ language, theme, setLanguage, setTheme }}>
      {children}
    </PreferencesContext>
  )
}
