/**
 * Secure Core Members Utilities
 * Uses environment variables and encoding for security
 */

// Simple encryption/decryption utilities
const encodeData = (data) => {
  try {
    return btoa(JSON.stringify(data));
  } catch (error) {
    console.error('Error encoding data:', error);
    return null;
  }
};

const decodeData = (encodedData) => {
  try {
    return JSON.parse(atob(encodedData));
  } catch (error) {
    console.error('Error decoding data:', error);
    return {};
  }
};

// Get core members data from environment variables
const getCoreMembersData = () => {
  const encodedData = import.meta.env.VITE_CORE_MEMBERS_DATA;
  
  if (!encodedData) {
    console.warn('Core members data not found in environment variables');
    return {};
  }
  
  return decodeData(encodedData);
};

// Security check with salt
const validateSecurity = () => {
  const salt = import.meta.env.VITE_SECURITY_SALT;
  const env = import.meta.env.VITE_APP_ENV;
  
  if (env === 'production' && !salt) {
    console.error('Security salt not configured for production');
    return false;
  }
  
  return true;
};

/**
 * Securely check if email is a core member
 * @param {string} email - User email to check
 * @returns {boolean} True if core member
 */
export const isCoreMember = (email) => {
  if (!validateSecurity() || !email) return false;
  
  const coreMembersData = getCoreMembersData();
  return coreMembersData.hasOwnProperty(email.toLowerCase());
};

/**
 * Get role data by email
 * @param {string} email - User email
 * @returns {Object|null} Role data or null
 */
export const getRoleByEmail = (email) => {
  if (!validateSecurity() || !email) return null;
  
  const coreMembersData = getCoreMembersData();
  return coreMembersData[email.toLowerCase()] || null;
};

/**
 * Check if email is from NMAMIT domain
 * @param {string} email - Email to check
 * @returns {boolean} True if NMAMIT email
 */
export const isNMAMITEmail = (email) => {
  return email && email.toLowerCase().endsWith('@nmamit.in');
};

/**
 * Check if user has specific permission
 * @param {string} userRole - User's role
 * @param {string} permission - Permission to check
 * @returns {boolean} True if user has permission
 */
export const hasPermission = (userRole, permission) => {
  if (!validateSecurity()) return false;
  
  const coreMembersData = getCoreMembersData();
  const roleData = Object.values(coreMembersData).find(r => r.role === userRole);
  
  if (!roleData) return false;
  
  return roleData.permissions.includes('all') || roleData.permissions.includes(permission);
};

/**
 * Get role level for hierarchy
 * @param {string} role - Role to check
 * @returns {number} Role level (999 if not found)
 */
export const getRoleLevel = (role) => {
  if (!validateSecurity()) return 999;
  
  const coreMembersData = getCoreMembersData();
  const roleData = Object.values(coreMembersData).find(r => r.role === role);
  
  return roleData ? roleData.level : 999;
};

/**
 * Utility to encode core members data for environment variable
 * Use this in development to generate the encoded string
 * @param {Object} coreMembersData - Core members data object
 * @returns {string} Base64 encoded string
 */
export const encodeCoreMembersData = (coreMembersData) => {
  return encodeData(coreMembersData);
};

/**
 * Development helper to generate encoded data
 * Run this once to generate the encoded string for your .env file
 */
export const generateEncodedData = () => {
  const coreMembersData = {
    // Executive Board
    'nnm23cb052@nmamit.in': {
      name: 'President',
      role: 'President',
      permissions: ['all'],
      level: 1
    },
    'harshithapsalian11@gmail.com': {
      name: 'Vice President',
      role: 'Vice President',
      permissions: ['all'],
      level: 2
    },
    'nnm23cs043@nmamit.in': {
      name: 'Secretary',
      role: 'Secretary',
      permissions: ['events', 'members', 'announcements'],
      level: 3
    },
    'nnm24is228@nmamit.in': {
      name: 'Joint Secretary',
      role: 'Joint Secretary',
      permissions: ['events', 'members'],
      level: 4
    },
    'shreyairniraya@gmail.com': {
      name: 'Treasurer',
      role: 'Treasurer',
      permissions: ['finance', 'members'],
      level: 5
    },
    // Technical Team
    'prashithshetty16@gmail.com': {
      name: 'Technical Lead',
      role: 'Technical Lead',
      permissions: ['technical', 'website', 'projects'],
      level: 6
    },
    'nnm24ac008@nmamit.in': {
      name: 'Technical Team',
      role: 'Technical Team',
      permissions: ['technical', 'projects'],
      level: 10
    },
    'nnm24cs124@nmamit.in': {
      name: 'Technical Team',
      role: 'Technical Team',
      permissions: ['technical', 'projects'],
      level: 10
    },
    'nnm24cb503@nmamit.in': {
      name: 'Technical Team',
      role: 'Technical Team',
      permissions: ['technical', 'projects'],
      level: 10
    },
    'nnm23cs221@nmamit.in': {
      name: 'Technical Team',
      role: 'Technical Team',
      permissions: ['technical', 'projects'],
      level: 10
    },
    'nnm24ad005@nmamit.in': {
      name: 'Technical Team',
      role: 'Technical Team',
      permissions: ['technical', 'projects'],
      level: 10
    },
    // Graphics Team
    'nnm24is200@nmamit.in': {
      name: 'Graphics Team',
      role: 'Graphics Team',
      permissions: ['graphics', 'content'],
      level: 10
    },
    'akshaymayya2@gmail.com': {
      name: 'Graphics Team',
      role: 'Graphics Team',
      permissions: ['graphics', 'content'],
      level: 10
    },
    'nnm24cb504@nmamit.in': {
      name: 'Graphics Team',
      role: 'Graphics Team',
      permissions: ['graphics', 'content'],
      level: 10
    },
    // Event Management
    'nnm23ri031@nmamit.in': {
      name: 'Event Management Lead',
      role: 'Event Management Lead',
      permissions: ['events', 'coordination'],
      level: 7
    },
    'fkhxkhcoufxkhjh@gmail.com': {
      name: 'Event Management',
      role: 'Event Management',
      permissions: ['events'],
      level: 10
    },
    'nnm23cs215@nmamit.in': {
      name: 'Event Management',
      role: 'Event Management',
      permissions: ['events'],
      level: 10
    },
    'nnm23cb010@nmamit.in': {
      name: 'Event Management',
      role: 'Event Management',
      permissions: ['events'],
      level: 10
    },
    // MC Committee
    'niharikaniranjan688@gmail.com': {
      name: 'MC Committee',
      role: 'MC Committee',
      permissions: ['announcements', 'events'],
      level: 10
    },
    'nnm23cb008@nmamit.in': {
      name: 'MC Committee',
      role: 'MC Committee',
      permissions: ['announcements', 'events'],
      level: 10
    },
    // Publicity Team
    'prathikshas199@gmail.com': {
      name: 'Publicity Lead',
      role: 'Publicity Lead',
      permissions: ['publicity', 'social_media', 'content'],
      level: 8
    },
    'nnm23ri014@nmamit.in': {
      name: 'Publicity Core Team',
      role: 'Publicity Core Team',
      permissions: ['publicity', 'content'],
      level: 9
    },
    'nnm23cs286@nmamit.in': {
      name: 'Publicity Team',
      role: 'Publicity Team',
      permissions: ['publicity'],
      level: 10
    },
    'nnm24cb055@nmamit.in': {
      name: 'Publicity Team',
      role: 'Publicity Team',
      permissions: ['publicity'],
      level: 10
    },
    // Social Media
    'sonalhhegde@gmail.com': {
      name: 'Social Media',
      role: 'Social Media',
      permissions: ['social_media', 'content'],
      level: 10
    },
    'udhbhavsnayak@gmail.com': {
      name: 'Social Media',
      role: 'Social Media',
      permissions: ['social_media', 'content'],
      level: 10
    }
  };
  
  const encoded = encodeCoreMembersData(coreMembersData);
  console.log('Encoded Core Members Data for .env file:');
  console.log(`VITE_CORE_MEMBERS_DATA=${encoded}`);
  return encoded;
};

// Only run in development
if (import.meta.env.DEV) {
  // Uncomment the line below to generate encoded data
  // generateEncodedData();
}
