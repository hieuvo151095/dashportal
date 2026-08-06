import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { FluentProvider } from '@fluentui/react-components'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { vaultlineTheme } from './theme/vaultlineTheme'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <FluentProvider theme={vaultlineTheme} style={{ height: '100%' }}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </FluentProvider>
  </StrictMode>,
)
