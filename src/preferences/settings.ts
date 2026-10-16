import type { Language } from '../data/menu'
export type Theme = 'light' | 'dark'
export const preferenceKeys = { language: 'syrian-menu-language', theme: 'syrian-menu-theme' }

export function resolvePreferences(
  language: string | null,
  theme: string | null,
  systemDark: boolean,
) {
  return {
    language: (language === 'ar' ? 'ar' : 'en') as Language,
    theme: (theme === 'light' || theme === 'dark' ? theme : systemDark ? 'dark' : 'light') as Theme,
  }
}

export function readPreference(key: string): string | null {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}
export function writePreference(key: string, value: string) {
  try {
    localStorage.setItem(key, value)
  } catch {
    /* Preferences still work for this visit. */
  }
}
