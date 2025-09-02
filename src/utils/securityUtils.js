/**
 * Security utilities for protecting the application
 */

// Input sanitization to prevent XSS attacks
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .replace(/`/g, '&#96;')
    .replace(/=/g, '&#x3D;');
};

// Validate and sanitize form data
export const sanitizeFormData = (formData) => {
  const sanitized = {};
  
  for (const [key, value] of Object.entries(formData)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeInput(value);
    } else {
      sanitized[key] = value;
    }
  }
  
  return sanitized;
};

// Validate payment amount to prevent manipulation
export const validatePaymentAmount = (amount, expectedAmount) => {
  return amount === expectedAmount;
};

// Generate secure transaction ID
export const generateTransactionId = () => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  const random2 = Math.random().toString(36).substring(2, 15);
  return `CSI_${timestamp}_${random}${random2}`;
};

// Encrypt sensitive data (for client-side temporary storage only)
export const encodeData = (data) => {
  try {
    return btoa(JSON.stringify(data));
  } catch (error) {
    // console.error('Encoding error:', error);
    return null;
  }
};

// Decrypt sensitive data
export const decodeData = (encodedData) => {
  try {
    return JSON.parse(atob(encodedData));
  } catch (error) {
    // console.error('Decoding error:', error);
    return null;
  }
};

// Validate email format
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate phone number
export const isValidPhone = (phone) => {
  const phoneRegex = /^[6-9]\d{9}$/; // Indian phone number format
  return phoneRegex.test(phone);
};

// Validate USN format
export const isValidUSN = (usn) => {
  const usnRegex = /^[1-4]NM(2[0-9])[A-Z]{2}\d{3}$/i;
  return usnRegex.test(usn);
};

// Rate limiting helper (client-side)
export const createRateLimiter = (maxAttempts = 5, windowMs = 60000) => {
  const attempts = new Map();
  
  return (key) => {
    const now = Date.now();
    const userAttempts = attempts.get(key) || [];
    
    // Clean old attempts
    const recentAttempts = userAttempts.filter(
      timestamp => now - timestamp < windowMs
    );
    
    if (recentAttempts.length >= maxAttempts) {
      return false; // Rate limit exceeded
    }
    
    recentAttempts.push(now);
    attempts.set(key, recentAttempts);
    return true; // Allowed
  };
};

// Content Security Policy headers (to be set on server)
export const getCSPHeaders = () => {
  return {
    'Content-Security-Policy': [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://checkout.razorpay.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "font-src 'self' data:",
      "connect-src 'self' https://api.razorpay.com https://api.cloudinary.com https://res.cloudinary.com",
      "frame-src https://api.razorpay.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "upgrade-insecure-requests"
    ].join('; ')
  };
};
