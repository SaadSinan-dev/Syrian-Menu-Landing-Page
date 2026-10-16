import { Moon, Sun } from 'lucide-react'
import { usePreferences } from '../preferences/context'
import { useCopy } from '../i18n/useCopy'

export function PreferenceControls() {
  const { language, theme, setLanguage, setTheme } = usePreferences()
  const { common } = useCopy()
  return (
    <div className="preference-controls">
      <button
        className="preference-button language-toggle"
        data-testid="language-toggle"
        onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
        aria-label={common.switchLanguage}
        title={common.switchLanguage}
      >
        <span lang={language === 'en' ? 'ar' : 'en'}>{common.languageName}</span>
      </button>
      <button
        className="preference-button theme-toggle"
        data-testid="theme-toggle"
        onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        aria-label={theme === 'light' ? common.toDark : common.toLight}
        title={theme === 'light' ? common.toDark : common.toLight}
        aria-pressed={theme === 'dark'}
      >
        <span className="theme-icon" key={theme}>
          {theme === 'light' ? (
            <Moon size={18} aria-hidden="true" />
          ) : (
            <Sun size={18} aria-hidden="true" />
          )}
        </span>
      </button>
    </div>
  )
}
