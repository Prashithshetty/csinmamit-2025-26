import { collection, getDocs } from "firebase/firestore"
import { db } from "../config/firebase"
import { CORE_MEMBERS } from "../constants/coreMembers"


/**
 * Get role from CORE_MEMBERS constant or Firestore data
 */
const getUserRole = (data) => {
  const email = data.email?.toLowerCase()
  if (email && CORE_MEMBERS[email]) {
    return CORE_MEMBERS[email].role
  }
  return data.profile?.role || data.roleDetails?.position || "Member"
}


/**
 * Sort members by role hierarchy
 */
const sortMembersByRole = (members) => {
  const roleOrder = {
    "President": 1,
    "Vice President": 2,
    "Secretary": 3,
    "Joint Secretary": 4,
    "Treasurer": 5,
    "Program Committee Head": 6,
    "Program Committee Co-head": 7,
    "Technical Lead": 8,
    "Technical (Lead)": 8,
    "Technical Team": 9,
    "Graphics Lead": 10,
    "Graphics Team": 11,
    "Graphics": 11,
    "Social Media Lead": 12,
    "Social Media": 13,
    "Publicity Lead": 14,
    "Publicity Core Team": 15,
    "Publicity (Lead)": 14,
    "Publicity Team": 16,
    "Publicity": 16,
    "Event Management Lead": 17,
    "Event Management": 18,
    "MC Committee": 19,
    "Member": 99,
  }


  return members.sort((a, b) => {
    const orderA = roleOrder[a.role] || 99
    const orderB = roleOrder[b.role] || 99
    return orderA - orderB
  })
}


/**
 * Deduplicate members by name (trial version)
 * Prefer Firestore or most recently updated entry
 */
const dedupeByName = (arr) => {
  const map = new Map()

  arr.forEach((m) => {
    const key = (m.name || "").toLowerCase() // use name as key
    const currentTimestamp = m.updatedAt ? new Date(m.updatedAt).getTime() : 0
    const isFirestore = !!m.fromFirestore

    if (!map.has(key)) {
      map.set(key, { ...m, _timestamp: currentTimestamp, _fromFirestore: isFirestore })
    } else {
      const existing = map.get(key)
      const existingTimestamp = existing._timestamp || 0

      // Prefer Firestore over JSON
      if (isFirestore && !existing._fromFirestore) {
        map.set(key, { ...m, _timestamp: currentTimestamp, _fromFirestore: true })
      } 
      // Otherwise, prefer the most recent
      else if (currentTimestamp > existingTimestamp) {
        map.set(key, { ...m, _timestamp: currentTimestamp, _fromFirestore: isFirestore })
      }
    }
  })

  return Array.from(map.values()).map(({ _timestamp, _fromFirestore, ...rest }) => rest)
}




/**
 * Fetch student core members:
 * - Try Firestore core members first,
 * - then merge local JSON teamData (studentTeamData),
 * - finally fallback to CORE_MEMBERS constant.
 */
export const fetchCoreMembers = async () => {
  try {
    let finalMembers = []


    // 1) Firestore: collect members flagged as coreMember or present in CORE_MEMBERS
    if (db) {
      try {
        const usersRef = collection(db, "users")
        const allUsersSnapshot = await getDocs(usersRef)
        const firestoreMembers = []


        allUsersSnapshot.forEach((doc) => {
          const data = doc.data()
          const email = data.email?.toLowerCase()
          const isInCoreMembers = email && CORE_MEMBERS[email]


          if (data.role === "coreMember" || data.isCoreMember === true || isInCoreMembers) {
            let m = { id: doc.id, ...data }


            if (isInCoreMembers) {
              m.role = "coreMember"
              m.isCoreMember = true
              m.roleDetails = m.roleDetails || {
                position: CORE_MEMBERS[email].role,
                permissions: CORE_MEMBERS[email].permissions,
                level: CORE_MEMBERS[email].level,
              }
            }


            // Normalize shape for the UI
            firestoreMembers.push({
              id: m.id,
              name: m.name || m.displayName || "Unknown",
              role: getUserRole(m),
              usn: m.profile?.usn || m.usn || "",
              branch: m.profile?.branch || m.branch || "",
              year: m.profile?.year || m.year || "",
              linkedin: m.profile?.linkedin || m.linkedin || "#",
              github: m.profile?.github || m.github || "#",
              imageSrc: m.photoURL || m.imageSrc || "/default-avatar.png",
              photoURL: m.photoURL || m.imageSrc || "/default-avatar.png",
              skills: m.profile?.skills || m.skills || [],
              bio: m.profile?.bio || m.bio || "",
              phone: m.profile?.phone || m.phone || "",
              email: m.email || "",
              isCoreMember: true,
              roleDetails: m.roleDetails,
            })
          }
        })


        if (firestoreMembers.length > 0) {
          finalMembers = [...finalMembers, ...firestoreMembers]
          console.log("fetchCoreMembers: loaded", firestoreMembers.length, "firestore core members")
        } else {
          console.log("fetchCoreMembers: no core members found in Firestore")
        }
      } catch (firestoreError) {
        console.warn("fetchCoreMembers: Firestore read failed:", firestoreError)
      }
    } else {
      console.warn("fetchCoreMembers: db is not available")
    }


    // 2) Try dynamic import of local JSON (teamData.json) and normalize shape
    try {
      const jsonModule = await import("../data/teamData.json")
      const teamData = jsonModule.default || jsonModule
      console.log("fetchCoreMembers: teamData.json loaded:", !!teamData)


      if (teamData?.studentTeamData && Array.isArray(teamData.studentTeamData)) {
        const mapped = teamData.studentTeamData.map((s, idx) => ({
          id: s.id || `json_student_${s.order ?? idx}_${(s.name || "").replace(/\s+/g, "_")}`,
          name: s.name || "Unknown",
          role: s.role || "Member",
          usn: s.usn || "",
          branch: s.branch || "",
          year: s.year || "",
          linkedin: s.linkedin || "#",
          github: s.github || "#",
          imageSrc: s.imageSrc || s.image || "/default-avatar.png",
          photoURL: s.imageSrc || s.image || "/default-avatar.png",
          skills: s.skills || [],
          bio: s.bio || s.description || "",
          phone: s.phone || "",
          email: s.email || "",
          isCoreMember: true, // mark JSON entries as core members too
        }))


        finalMembers = [...finalMembers, ...mapped]
        console.log("fetchCoreMembers: merged", mapped.length, "JSON members")
      } else {
        console.log("fetchCoreMembers: teamData.json has no studentTeamData")
      }
    } catch (jsonErr) {
      console.warn("fetchCoreMembers: failed to import teamData.json:", jsonErr)
    }


    // 3) If still empty, fallback to CORE_MEMBERS constant
    if (finalMembers.length === 0) {
      const membersFromConstants = Object.entries(CORE_MEMBERS).map(([email, memberInfo]) => ({
        id: email.replace(/[@.]/g, "_"),
        email,
        name: memberInfo.name || email.split("@")[0],
        role: memberInfo.role || "coreMember",
        isCoreMember: true,
        roleDetails: {
          position: memberInfo.role,
          permissions: memberInfo.permissions,
          level: memberInfo.level,
        },
        photoURL: memberInfo.photoURL || "/default-avatar.png",
        profile: {
          role: memberInfo.role,
          branch: "",
          year: "",
          linkedin: "#",
          github: "#",
          skills: [],
          bio: "",
        },
      }))


      finalMembers = [...membersFromConstants]
      console.log("fetchCoreMembers: using CORE_MEMBERS constant fallback, count:", finalMembers.length)
    }


    // Dedupe by email or id (Firestore entries will generally take precedence)
   const deduped = dedupeByName(finalMembers)



    // Sort and return
    const sorted = sortMembersByRole(deduped)
    console.log("fetchCoreMembers: returning", sorted.length, "members total")
    return sorted
  } catch (error) {
    console.error("fetchCoreMembers: unexpected error:", error)
    return []
  }
}


/**
 * Fetch faculty members
 */
export const fetchFacultyMembers = async () => {
  try {
    // dynamic import of the JSON so bundler won't choke on assert issues
    const jsonModule = await import("../data/teamData.json")
    const teamData = jsonModule.default || jsonModule
    return teamData?.facultyData || []
  } catch (err) {
    console.warn("fetchFacultyMembers: failed to import faculty data:", err)
    return []
  }
}


/**
 * Transform Firestore user data to team member format (utility)
 */
export const transformUserToTeamMember = (userData) => {
  return {
    id: userData.uid,
    name: userData.name || "Unknown",
    role: getUserRole(userData),
    usn: userData.profile?.usn || userData.usn || "",
    branch: userData.profile?.branch || "",
    year: userData.profile?.year || "",
    linkedin: userData.profile?.linkedin || "#",
    github: userData.profile?.github || "#",
    imageSrc: userData.photoURL || "/default-avatar.png",
    photoURL: userData.photoURL || "/default-avatar.png",
    skills: userData.profile?.skills || [],
    bio: userData.profile?.bio || "",
    email: userData.email || "",
    isCoreMember: userData.role === "coreMember" || userData.isCoreMember || false,
  }
}


/**
 * Check if a user has updated their profile
 */
export const isProfileComplete = (member) => {
  return !!(
    (member.photoURL || member.imageSrc) &&
    (member.photoURL || member.imageSrc) !== "/default-avatar.png" &&
    member.profile?.branch &&
    member.profile?.year &&
    (member.profile?.linkedin || member.profile?.github)
  )
}
