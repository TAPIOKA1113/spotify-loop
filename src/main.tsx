import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { UIProvider } from '@yamada-ui/react'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <UIProvider>
      <App />
    </UIProvider>
  </StrictMode>,
)
