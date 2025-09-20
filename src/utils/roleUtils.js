export function getUserRole(user) {
  if (user.roleDetails?.position) return user.roleDetails.position
  if (user.profile?.role) return user.profile.role
  return user.role || "Member"
}

export function sortMembersByRole(members) {
  const roleOrder = [
    "President",
    "Vice President",
    "Secretary",
    "Joint Secretary",
    "Treasurer",
    "Program Committee Head",
    "Program Committee Co-head",
    "Technical (Lead)",
    "Technical Team",
    "Graphics",
    "Social Media",
    "Publicity (Lead)",
    "Publicity",
    "Event Management Lead",
    "Event Management",
    "MC Committee",
    "Member",
  ]

  return members.sort((a, b) => {
    const indexA = roleOrder.indexOf(getUserRole(a)) !== -1 ? roleOrder.indexOf(getUserRole(a)) : roleOrder.length
    const indexB = roleOrder.indexOf(getUserRole(b)) !== -1 ? roleOrder.indexOf(getUserRole(b)) : roleOrder.length
    return indexA - indexB
  })
}
