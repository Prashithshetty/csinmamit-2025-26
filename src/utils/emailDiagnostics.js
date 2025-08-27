/**
 * Email Diagnostics Tool
 * Helps diagnose EmailJS configuration issues
 */

import emailjs from '@emailjs/browser'
import { EMAILJS_CONFIG } from '../config/emailjs'

export const runEmailDiagnostics = async () => {
  console.log('🔍 Running EmailJS Diagnostics...')
  console.log('=====================================')
  
  const diagnostics = {
    configuration: {},
    initialization: false,
    testEmail: false,
    errors: []
  }
  
  // 1. Check Configuration
  console.log('\n1️⃣ Checking Configuration:')
  console.log('----------------------------')
  
  if (EMAILJS_CONFIG.SERVICE_ID) {
    console.log('✅ SERVICE_ID is set:', EMAILJS_CONFIG.SERVICE_ID)
    diagnostics.configuration.serviceId = true
  } else {
    console.log('❌ SERVICE_ID is missing')
    diagnostics.configuration.serviceId = false
    diagnostics.errors.push('SERVICE_ID not configured')
  }
  
  if (EMAILJS_CONFIG.OTP_TEMPLATE_ID) {
    console.log('✅ OTP_TEMPLATE_ID is set:', EMAILJS_CONFIG.OTP_TEMPLATE_ID)
    diagnostics.configuration.templateId = true
  } else {
    console.log('❌ OTP_TEMPLATE_ID is missing')
    diagnostics.configuration.templateId = false
    diagnostics.errors.push('OTP_TEMPLATE_ID not configured')
  }
  
  if (EMAILJS_CONFIG.PUBLIC_KEY) {
    console.log('✅ PUBLIC_KEY is set:', EMAILJS_CONFIG.PUBLIC_KEY.substring(0, 10) + '...')
    diagnostics.configuration.publicKey = true
  } else {
    console.log('❌ PUBLIC_KEY is missing')
    diagnostics.configuration.publicKey = false
    diagnostics.errors.push('PUBLIC_KEY not configured')
  }
  
  // 2. Check Initialization
  console.log('\n2️⃣ Checking EmailJS Initialization:')
  console.log('-------------------------------------')
  
  try {
    if (EMAILJS_CONFIG.PUBLIC_KEY) {
      emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY)
      console.log('✅ EmailJS initialized successfully')
      diagnostics.initialization = true
    } else {
      console.log('❌ Cannot initialize EmailJS without PUBLIC_KEY')
      diagnostics.errors.push('EmailJS initialization failed - missing PUBLIC_KEY')
    }
  } catch (error) {
    console.log('❌ EmailJS initialization failed:', error.message)
    diagnostics.initialization = false
    diagnostics.errors.push(`Initialization error: ${error.message}`)
  }
  
  // 3. Test Email Send (Optional - requires user confirmation)
  console.log('\n3️⃣ Test Email Configuration:')
  console.log('-----------------------------')
  
  if (diagnostics.configuration.serviceId && 
      diagnostics.configuration.templateId && 
      diagnostics.configuration.publicKey) {
    
    console.log('Configuration appears complete. You can test sending an email.')
    console.log('\nTo send a test email, run:')
    console.log('testEmailSend("your-email@example.com")')
    
  } else {
    console.log('❌ Cannot test email sending - configuration incomplete')
    console.log('\nMissing configurations:')
    if (!diagnostics.configuration.serviceId) console.log('  - SERVICE_ID')
    if (!diagnostics.configuration.templateId) console.log('  - OTP_TEMPLATE_ID')
    if (!diagnostics.configuration.publicKey) console.log('  - PUBLIC_KEY')
  }
  
  // 4. Common Issues Check
  console.log('\n4️⃣ Common Issues Check:')
  console.log('------------------------')
  
  // Check if running in development
  if (import.meta.env.DEV) {
    console.log('ℹ️ Running in development mode')
  } else {
    console.log('ℹ️ Running in production mode')
  }
  
  // Check if .env.local exists (we can't read it, but we can check)
  console.log('\n📁 Environment Files:')
  console.log('  - Make sure you have a .env.local file in the root directory')
  console.log('  - Variables must start with VITE_ prefix')
  console.log('  - After adding/changing .env.local, restart the dev server')
  
  // 5. Summary
  console.log('\n📊 Diagnostics Summary:')
  console.log('========================')
  
  const allConfigured = diagnostics.configuration.serviceId && 
                        diagnostics.configuration.templateId && 
                        diagnostics.configuration.publicKey
  
  if (allConfigured && diagnostics.initialization) {
    console.log('✅ EmailJS appears to be properly configured!')
    console.log('\nNext steps:')
    console.log('1. Verify your EmailJS dashboard settings')
    console.log('2. Check that your email service is active')
    console.log('3. Ensure your template variables match')
    console.log('4. Test with: testEmailSend("your-email@example.com")')
  } else {
    console.log('❌ EmailJS configuration issues detected!')
    console.log('\nIssues found:')
    diagnostics.errors.forEach(error => console.log(`  - ${error}`))
    console.log('\nTo fix:')
    console.log('1. Create/update your .env.local file with:')
    console.log('   VITE_EMAILJS_SERVICE_ID=your_service_id')
    console.log('   VITE_EMAILJS_OTP_TEMPLATE_ID=your_template_id')
    console.log('   VITE_EMAILJS_PUBLIC_KEY=your_public_key')
    console.log('2. Restart your development server (yarn dev)')
    console.log('3. Run diagnostics again: runEmailDiagnostics()')
  }
  
  return diagnostics
}

// Test function to send a test email
export const testEmailSend = async (testEmail) => {
  if (!testEmail) {
    console.error('Please provide an email address')
    return
  }
  
  console.log(`\n🧪 Testing email send to: ${testEmail}`)
  console.log('=====================================')
  
  try {
    // Initialize EmailJS if not already done
    if (EMAILJS_CONFIG.PUBLIC_KEY) {
      emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY)
    }
    
    // Generate test OTP
    const testOTP = Math.floor(100000 + Math.random() * 900000).toString()
    
    // Prepare test parameters
    const templateParams = {
      to_email: testEmail,
      to_name: 'Test User',
      from_name: 'CSI NMAMIT',
      reply_to: 'csidatabasenmamit@gmail.com',
      otp_code: testOTP,
      valid_time: '10 minutes',
      current_year: new Date().getFullYear(),
      app_name: 'CSI NMAMIT Admin Panel',
      support_email: 'csidatabasenmamit@gmail.com'
    }
    
    console.log('📧 Sending test email with parameters:')
    console.log('  Service ID:', EMAILJS_CONFIG.SERVICE_ID)
    console.log('  Template ID:', EMAILJS_CONFIG.OTP_TEMPLATE_ID)
    console.log('  To:', testEmail)
    console.log('  Test OTP:', testOTP)
    
    const response = await emailjs.send(
      EMAILJS_CONFIG.SERVICE_ID,
      EMAILJS_CONFIG.OTP_TEMPLATE_ID,
      templateParams
    )
    
    console.log('\n✅ Test email sent successfully!')
    console.log('Response:', response)
    console.log(`\nCheck ${testEmail} for the test OTP: ${testOTP}`)
    console.log('Also check your spam/junk folder if not in inbox.')
    
    return { success: true, otp: testOTP, response }
    
  } catch (error) {
    console.error('\n❌ Test email failed!')
    console.error('Error:', error)
    
    if (error.text) {
      console.error('Error details:', error.text)
      
      // Parse specific errors
      if (error.text.includes('The Public Key is invalid')) {
        console.error('\n🔑 Invalid Public Key!')
        console.error('Check your VITE_EMAILJS_PUBLIC_KEY in .env.local')
        console.error('Get the correct key from: https://dashboard.emailjs.com/account')
      } else if (error.text.includes('The Service ID is invalid')) {
        console.error('\n🏢 Invalid Service ID!')
        console.error('Check your VITE_EMAILJS_SERVICE_ID in .env.local')
        console.error('Get the correct ID from: https://dashboard.emailjs.com/admin')
      } else if (error.text.includes('The Template ID is invalid')) {
        console.error('\n📄 Invalid Template ID!')
        console.error('Check your VITE_EMAILJS_OTP_TEMPLATE_ID in .env.local')
        console.error('Get the correct ID from: https://dashboard.emailjs.com/admin/templates')
      } else if (error.text.includes('The daily quota')) {
        console.error('\n📊 Daily quota exceeded!')
        console.error('Free plan limit reached. Wait until tomorrow or upgrade your plan.')
      }
    }
    
    return { success: false, error }
  }
}

// Export for use in browser console
if (typeof window !== 'undefined') {
  window.runEmailDiagnostics = runEmailDiagnostics
  window.testEmailSend = testEmailSend
}

export default {
  runEmailDiagnostics,
  testEmailSend
}
