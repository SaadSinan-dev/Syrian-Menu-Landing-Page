import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './base.css'
import App from './App.tsx'
import { PreferencesProvider } from './preferences/PreferencesProvider'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PreferencesProvider>
      <App />
    </PreferencesProvider>
  </StrictMode>,
)
