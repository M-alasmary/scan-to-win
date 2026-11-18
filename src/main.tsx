import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/cairo'
import '@fontsource-variable/space-grotesk'
import './index.css'
import App from './App'
import { LangProvider } from './lib/i18n'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LangProvider>
      <App />
    </LangProvider>
  </StrictMode>,
)
