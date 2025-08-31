/**
 * Secure Core Members Configuration
 * Uses environment variables and server-side validation for security
 */

// Role Categories for grouping (safe to keep client-side)
export const ROLE_CATEGORIES = {
  'Executive Board': ['President', 'Vice President', 'Secretary', 'Joint Secretary', 'Treasurer'],
  'Technical': ['Technical Lead', 'Technical Team'],
  'Creative': ['Graphics Team'],
  'Events': ['Event Management Lead', 'Event Management', 'MC Committee'],
  'Marketing': ['Publicity Lead', 'Publicity Core Team', 'Publicity Team', 'Social Media']
};

// Permission Definitions (safe to keep client-side)
export const PERMISSIONS = {
  'all': 'Full system access',
  'events': 'Manage events and workshops',
  'members': 'View and manage member data',
  'announcements': 'Create and manage announcements',
  'finance': 'Access financial data and reports',
  'technical': 'Access technical resources and projects',
  'website': 'Manage website content',
  'projects': 'View and manage technical projects',
  'graphics': 'Create and manage graphics content',
  'content': 'Create and manage content',
  'publicity': 'Manage publicity campaigns',
  'social_media': 'Manage social media accounts',
  'coordination': 'Coordinate between teams'
};

// Secure API endpoint for core member validation
const CORE_MEMBER_API_ENDPOINT = import.meta.env.VITE_CORE_MEMBER_API || '/api/core-members';

/**
 * Securely check if email is a core member via server API
 * @param {string} email - User email to check
 * @returns {Promise<Object|null>} Core member data or null
 */
export const validateCoreMember = async (email) => {
  if (!email) return null;
  
  try {
    const response = await fetch(`${CORE_MEMBER_API_ENDPOINT}/validate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}` // Add auth token
      },
      body: JSON.stringify({ email: email.toLowerCase() })
    });
    
    if (!response.ok) {
      throw new Error('Failed to validate core member');
    }
    
    const data = await response.json();
    return data.isCoreMember ? data.memberData : null;
  } catch (error) {
    // console.error('Error validating core member:', error);
    return null;
  }
};

/**
 * Get core member role data securely
 * @param {string} email - User email
 * @returns {Promise<Object|null>} Role data or null
 */
export const getRoleByEmail = async (email) => {
  return await validateCoreMember(email);
};

/**
 * Check if email is from NMAMIT domain (safe client-side check)
 * @param {string} email - Email to check
 * @returns {boolean} True if NMAMIT email
 */
export const isNMAMITEmail = (email) => {
  return email && email.toLowerCase().endsWith('@nmamit.in');
};

/**
 * Check if user has specific permission (requires server validation)
 * @param {string} userRole - User's role
 * @param {string} permission - Permission to check
 * @returns {Promise<boolean>} True if user has permission
 */
export const hasPermission = async (userRole, permission) => {
  try {
    const response = await fetch(`${CORE_MEMBER_API_ENDPOINT}/check-permission`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      },
      body: JSON.stringify({ role: userRole, permission })
    });
    
    if (!response.ok) return false;
    
    const data = await response.json();
    return data.hasPermission;
  } catch (error) {
    // console.error('Error checking permission:', error);
    return false;
  }
};

/**
 * Get role level for hierarchy (requires server validation)
 * @param {string} role - Role to check
 * @returns {Promise<number>} Role level (999 if not found)
 */
export const getRoleLevel = async (role) => {
  try {
    const response = await fetch(`${CORE_MEMBER_API_ENDPOINT}/role-level`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      },
      body: JSON.stringify({ role })
    });
    
    if (!response.ok) return 999;
    
    const data = await response.json();
    return data.level || 999;
  } catch (error) {
    // console.error('Error getting role level:', error);
    return 999;
  }
};

// Fallback for development/testing (should be removed in production)
const DEV_CORE_MEMBERS = import.meta.env.DEV ? {
  // Only include a few test emails for development
  'test@nmamit.in': {
    name: 'Test User',
    role: 'Technical Team',
    permissions: ['technical', 'projects'],
    level: 10
  }
} : {};

/**
 * Development fallback - check if email is core member (DEV ONLY)
 * @param {string} email - Email to check
 * @returns {boolean} True if core member in dev mode
 */
export const isCoreMemberDev = (email) => {
  if (!import.meta.env.DEV) return false;
  return email && DEV_CORE_MEMBERS.hasOwnProperty(email.toLowerCase());
};

/**
 * Development fallback - get role by email (DEV ONLY)
 * @param {string} email - Email to check
 * @returns {Object|null} Role data or null
 */
export const getRoleByEmailDev = (email) => {
  if (!import.meta.env.DEV) return null;
  if (!email) return null;
  return DEV_CORE_MEMBERS[email.toLowerCase()] || null;
};
