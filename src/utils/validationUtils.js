/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} - True if valid email
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate phone number (10 digits)
 * @param {string} phone - Phone number to validate
 * @returns {boolean} - True if valid phone number
 */
export const validatePhone = (phone) => {
  return /^\d{10}$/.test(phone)
}

/**
 * Validate USN format
 * @param {string} usn - USN to validate
 * @returns {boolean} - True if valid USN
 */
export const validateUSN = (usn) => {
  const usnRegex = /^[1-4][A-Z]{2}\d{2}[A-Z]{2}\d{3}$/i
  return usnRegex.test(usn)
}

/**
 * Validate required fields in a form
 * @param {Object} formData - Form data object
 * @param {Array} requiredFields - Array of required field names
 * @returns {Object} - { isValid: boolean, errors: Object }
 */
export const validateRequiredFields = (formData, requiredFields) => {
  const errors = {}
  let isValid = true

  requiredFields.forEach(field => {
    if (!formData[field] || formData[field].trim() === '') {
      errors[field] = `${field} is required`
      isValid = false
    }
  })

  return { isValid, errors }
}

/**
 * Sanitize input to prevent XSS
 * @param {string} input - Input to sanitize
 * @returns {string} - Sanitized input
 */
export const sanitizeInput = (input) => {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
}
