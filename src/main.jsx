import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'

// Import email diagnostics for debugging
import { runEmailDiagnostics, testEmailSend } from './utils/emailDiagnostics'

// Make diagnostics available in browser console
if (import.meta.env.DEV) {
  window.runEmailDiagnostics = runEmailDiagnostics
  window.testEmailSend = testEmailSend
  
  console.log('🔧 Email Diagnostics Tools Available:')
  console.log('  - runEmailDiagnostics() : Check EmailJS configuration')
  console.log('  - testEmailSend("your-email@example.com") : Send test OTP email')
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
