/**
 * Core Members Configuration
 * Maps email addresses to their CSI roles
 */

export const CORE_MEMBERS = {
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

// Role Categories for grouping
export const ROLE_CATEGORIES = {
  'Executive Board': ['President', 'Vice President', 'Secretary', 'Joint Secretary', 'Treasurer'],
  'Technical': ['Technical Lead', 'Technical Team'],
  'Creative': ['Graphics Team'],
  'Events': ['Event Management Lead', 'Event Management', 'MC Committee'],
  'Marketing': ['Publicity Lead', 'Publicity Core Team', 'Publicity Team', 'Social Media']
};

// Permission Definitions
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

// Helper function to check if email is a core member
export const isCoreMember = (email) => {
  return email && CORE_MEMBERS.hasOwnProperty(email.toLowerCase());
};

// Helper function to get role by email
export const getRoleByEmail = (email) => {
  if (!email) return null;
  return CORE_MEMBERS[email.toLowerCase()] || null;
};

// Helper function to check if email is from NMAMIT domain
export const isNMAMITEmail = (email) => {
  return email && email.toLowerCase().endsWith('@nmamit.in');
};

// Helper function to check if user has permission
export const hasPermission = (userRole, permission) => {
  const roleData = Object.values(CORE_MEMBERS).find(r => r.role === userRole);
  if (!roleData) return false;
  return roleData.permissions.includes('all') || roleData.permissions.includes(permission);
};

// Helper function to get role level (for hierarchy)
export const getRoleLevel = (role) => {
  const roleData = Object.values(CORE_MEMBERS).find(r => r.role === role);
  return roleData ? roleData.level : 999;
};
