import { createContext, useContext } from 'react'
import type { Language } from '../data/menu'
import type { Theme } from './settings'

interface Preferences {
  language: Language
  theme: Theme
  setLanguage: (language: Language) => void
  setTheme: (theme: Theme) => void
}
export const PreferencesContext = createContext<Preferences | null>(null)
export function usePreferences() {
  const context = useContext(PreferencesContext)
  if (!context) throw new Error('PreferencesProvider is required')
  return context
}
