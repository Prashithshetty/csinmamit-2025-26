/**
 * EmailJS Configuration
 * Handles SMTP email sending directly from the frontend
 * No backend required - uses EmailJS service
 */

// EmailJS Configuration
// You'll need to sign up at https://www.emailjs.com/ and get these values
export const EMAILJS_CONFIG = {
  // Service ID from EmailJS dashboard
  SERVICE_ID: import.meta.env.VITE_EMAILJS_SERVICE_ID || '',
  
  // Template ID for OTP emails
  OTP_TEMPLATE_ID: import.meta.env.VITE_EMAILJS_OTP_TEMPLATE_ID || '',
  
  // Public Key from EmailJS dashboard
  PUBLIC_KEY: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '',
  
  // Optional: Private key for added security (not recommended for frontend)
  // PRIVATE_KEY: import.meta.env.VITE_EMAILJS_PRIVATE_KEY || ''
}

// Validate configuration
export const validateEmailJSConfig = () => {
  const missingConfigs = []
  
  if (!EMAILJS_CONFIG.SERVICE_ID) {
    missingConfigs.push('VITE_EMAILJS_SERVICE_ID')
  }
  
  if (!EMAILJS_CONFIG.OTP_TEMPLATE_ID) {
    missingConfigs.push('VITE_EMAILJS_OTP_TEMPLATE_ID')
  }
  
  if (!EMAILJS_CONFIG.PUBLIC_KEY) {
    missingConfigs.push('VITE_EMAILJS_PUBLIC_KEY')
  }
  
  if (missingConfigs.length > 0) {
    console.warn('⚠️ EmailJS configuration missing:', missingConfigs.join(', '))
    console.warn('Please add these to your .env file')
    return false
  }
  
  return true
}

// Email template parameters helper
export const createOTPEmailParams = (toEmail, toName, otp) => {
  // EmailJS might use different parameter names
  // Common variations: to_email, user_email, email, recipient_email
  return {
    // Try multiple email field names for compatibility
    to_email: toEmail,
    user_email: toEmail,  // Alternative field name
    email: toEmail,       // Another common field name
    recipient_email: toEmail, // Another variation
    
    // Name fields
    to_name: toName || 'Admin',
    user_name: toName || 'Admin',  // Alternative field name
    name: toName || 'Admin',       // Another common field name
    
    // OTP and other fields - try ALL possible variations
    from_name: 'CSI NMAMIT',
    reply_to: 'csidatabasenmamit@gmail.com',
    
    // All possible OTP field variations
    passcode: otp,  // YOUR TEMPLATE USES THIS!
    otp_code: otp,
    otp: otp,
    code: otp,
    OTP: otp,  // Uppercase variation
    OTP_CODE: otp,  // Uppercase with underscore
    otpCode: otp,  // camelCase
    verification_code: otp,
    verificationCode: otp,
    pin: otp,
    PIN: otp,
    token: otp,
    
    // Time validity and expiry
    time: new Date(Date.now() + 15 * 60 * 1000).toLocaleString('en-US', { 
      hour: 'numeric', 
      minute: 'numeric', 
      hour12: true,
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }),  // YOUR TEMPLATE USES THIS! Format: "Dec 19, 2024, 3:15 PM"
    valid_time: '15 minutes',
    validity: '15 minutes',
    expiry_time: '15 minutes',
    
    current_year: new Date().getFullYear(),
    
    // Additional parameters
    app_name: 'CSI NMAMIT Admin Panel',
    support_email: 'csidatabasenmamit@gmail.com',
    message: `Your OTP code is: ${otp}. Valid for 10 minutes.` // Fallback message field
  }
}

// SMTP Configuration Guide for EmailJS
export const SMTP_SETUP_GUIDE = `
EmailJS Setup Instructions:

1. Sign up at https://www.emailjs.com/
2. Add an email service (Gmail, Outlook, or custom SMTP)
3. Create an email template with these variables:
   - {{to_email}} - Recipient email
   - {{to_name}} - Recipient name
   - {{otp_code}} - The OTP code
   - {{valid_time}} - OTP validity duration
   
4. Get your credentials from EmailJS dashboard:
   - Service ID
   - Template ID
   - Public Key
   
5. Add to your .env file:
   VITE_EMAILJS_SERVICE_ID=your_service_id
   VITE_EMAILJS_OTP_TEMPLATE_ID=your_template_id
   VITE_EMAILJS_PUBLIC_KEY=your_public_key

For custom SMTP in EmailJS:
- SMTP Server: smtp.gmail.com (for Gmail)
- Port: 587 (TLS) or 465 (SSL)
- Username: your email
- Password: app-specific password
`

export default EMAILJS_CONFIG
