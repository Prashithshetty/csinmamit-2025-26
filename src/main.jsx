import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'

// In production, silence all console output to prevent accidental data exposure
if (import.meta.env.PROD) {
  const noop = () => {}
  // Preserve original methods if needed: const originalConsoleLog = console.log
  console.log = noop
  console.info = noop
  console.warn = noop
  console.error = noop
  console.debug = noop
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
