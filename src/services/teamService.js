import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '../config/firebase'
import { CORE_MEMBERS } from '../constants/coreMembers'

/**
 * Get role from CORE_MEMBERS constant or Firestore data
 * @param {Object} data - User data from Firestore
 * @returns {string} User's role
 */
const getUserRole = (data) => {
  // First, check if the email exists in CORE_MEMBERS constant
  const email = data.email?.toLowerCase()
  if (email && CORE_MEMBERS[email]) {
    return CORE_MEMBERS[email].role
  }
  
  // Fallback to Firestore data
  return data.profile?.role || data.roleDetails?.position || 'Member'
}

/**
 * Fetch all core members from Firestore
 * @returns {Promise<Array>} Array of core member profiles
 */
export const fetchCoreMembers = async () => {
  try {
    const usersRef = collection(db, 'users')
    // Simplified query without orderBy to avoid index requirements
    const q = query(
      usersRef,
      where('role', '==', 'coreMember')
    )
    
    let querySnapshot
    try {
      querySnapshot = await getDocs(q)
    } catch (permissionError) {
      console.warn('Permission error fetching core members, trying alternative approach:', permissionError)
      
      // If permission fails, try fetching all users and filter client-side
      try {
        const allUsersSnapshot = await getDocs(usersRef)
        const coreMembersData = []
        
        allUsersSnapshot.forEach((doc) => {
          const data = doc.data()
          // Check if user is a core member either by Firestore role or email in CORE_MEMBERS
          const email = data.email?.toLowerCase()
          const isInCoreMembers = email && CORE_MEMBERS[email]
          
          if (data.role === 'coreMember' || data.isCoreMember || isInCoreMembers) {
            coreMembersData.push({ id: doc.id, ...data })
          }
          console.log(data.isCoreMember, data.role, 'Core Member Check')
        })
        
        // Process the filtered data
        const members = coreMembersData.map(data => ({
          id: data.id,
          name: data.name || 'Unknown',
          role: getUserRole(data), // Use the helper function to get role
          usn: data.profile?.usn || data.usn || '',
          branch: data.profile?.branch || '',
          year: data.profile?.year || '',
          linkedin: data.profile?.linkedin || '#',
          github: data.profile?.github || '#',
          imageSrc: data.photoURL || '/default-avatar.png',
          skills: data.profile?.skills || [],
          bio: data.profile?.bio || '',
          phone: data.profile?.phone || '',
          email: data.email || '',
          isCoreMember: true,
          ...data
        }))
        
        // Sort by role hierarchy
        return sortMembersByRole(members)
      } catch (fallbackError) {
        console.error('Failed to fetch users, using static data:', fallbackError)
        throw fallbackError
      }
    }
    
    const members = []
    
    querySnapshot.forEach((doc) => {
      const data = doc.data()
      members.push({
        id: doc.id,
        name: data.name || 'Unknown',
        role: getUserRole(data), // Use the helper function to get role
        usn: data.profile?.usn || data.usn || '',
        branch: data.profile?.branch || '',
        year: data.profile?.year || '',
        linkedin: data.profile?.linkedin || '#',
        github: data.profile?.github || '#',
        imageSrc: data.photoURL || '/default-avatar.png',
        skills: data.profile?.skills || [],
        bio: data.profile?.bio || '',
        phone: data.profile?.phone || '',
        email: data.email || '',
        isCoreMember: true,
        ...data
      })
    })
    
    
    // Sort by role hierarchy
    return sortMembersByRole(members)
  } catch (error) {
    console.error('Error fetching core members:', error)
    // Return fallback data from JSON if Firestore fails
    try {
      const { studentTeamData } = await import('../data/teamData.json')
      return studentTeamData || []
    } catch (importError) {
      console.error('Failed to import fallback data:', importError)
      return []
    }
  }
}

/**
 * Sort members by role hierarchy
 * @param {Array} members - Array of team members
 * @returns {Array} Sorted array of team members
 */
const sortMembersByRole = (members) => {
  const roleOrder = {
    'President': 1,
    'Vice President': 2,
    'Secretary': 3,
    'Joint Secretary': 4,
    'Treasurer': 5,
    'Program Committee Head': 6,
    'Program Committee Co-head': 7,
    'Technical Lead': 8,
    'Technical (Lead)': 8,
    'Technical Team': 9,
    'Graphics Lead': 10,
    'Graphics': 11,
    'Social Media Lead': 12,
    'Social Media': 13,
    'Publicity Lead': 14,
    'Publicity (Lead)': 14,
    'Publicity': 15,
    'Event Management Lead': 16,
    'Event Management': 17,
    'MC Committee': 18,
    'Member': 99
  }
  
  return members.sort((a, b) => {
    const orderA = roleOrder[a.role] || 99
    const orderB = roleOrder[b.role] || 99
    return orderA - orderB
  })
}

/**
 * Fetch faculty members
 * For now, returns static data as faculty are not in Firestore
 * @returns {Promise<Array>} Array of faculty profiles
 */
export const fetchFacultyMembers = async () => {
  try {
    // You can implement Firestore fetch for faculty if needed
    // For now, return static data
    const { facultyData } = await import('../data/teamData.json')
    return facultyData
  } catch (error) {
    console.error('Error fetching faculty members:', error)
    return []
  }
}

/**
 * Transform Firestore user data to team member format
 * @param {Object} userData - Raw user data from Firestore
 * @returns {Object} Formatted team member object
 */
export const transformUserToTeamMember = (userData) => {
  return {
    id: userData.uid,
    name: userData.name || 'Unknown',
    role: getUserRole(userData), // Use the helper function to get role
    usn: userData.profile?.usn || userData.usn || '',
    branch: userData.profile?.branch || '',
    year: userData.profile?.year || '',
    linkedin: userData.profile?.linkedin || '#',
    github: userData.profile?.github || '#',
    imageSrc: userData.photoURL || '/default-avatar.png',
    skills: userData.profile?.skills || [],
    bio: userData.profile?.bio || '',
    email: userData.email || '',
    isCoreMember: userData.role === 'coreMember' || userData.isCoreMember || false
  }
}

/**
 * Check if a user has updated their profile
 * @param {Object} member - Team member object
 * @returns {boolean} True if profile is complete
 */
export const isProfileComplete = (member) => {
  return !!(
    member.photoURL && 
    member.photoURL !== '/default-avatar.png' &&
    member.profile?.branch &&
    member.profile?.year &&
    (member.profile?.linkedin || member.profile?.github)
  )
}
