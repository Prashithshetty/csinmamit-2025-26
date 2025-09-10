import { useState, useEffect, useCallback, useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { useAdminAuth } from '../../../contexts/AdminAuthContext'
import { UserCheck, Filter, Download, FileText, FileJson } from 'lucide-react'
import {
  collection,
  query,
  getDocs,
  doc,
  updateDoc,
  where,
  addDoc,
  setDoc,
  Timestamp
} from 'firebase/firestore'
import { db, auth } from '../../../config/firebase'
import toast from 'react-hot-toast'

// Component imports
import SearchBar from './components/SearchBar'
import BranchFilter from './components/BranchFilter'
import TableHeader from './components/TableHeader'
import MemberRow from './components/MemberRow'
import Pagination from './components/Pagination'
import MemberDetailsModal from './components/MemberDetailsModal'
import RemoveRoleModal from './components/RemoveRoleModal'
import AddMemberModal from './components/AddMemberModal'
import EditMemberModal from './components/EditMemberModal'

// Utility imports
import { MEMBERS_PER_PAGE, TABLE_HEADERS, ROLE_OPTIONS } from './utils/constants'
import { exportMembersToCSV, exportMembersToJSON } from './utils/helpers'

const AdminEMembers = () => {
  const { logAdminActivity } = useAdminAuth()
  const location = useLocation()
  
  // State management
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterBranch, setFilterBranch] = useState('all')
  const [filterRole, setFilterRole] = useState('all')
  const [selectedMembers, setSelectedMembers] = useState([])
  const [selectAll, setSelectAll] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [sortField, setSortField] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState('desc')
  
  // Modal states
  const [showRemoveModal, setShowRemoveModal] = useState(false)
  const [memberToRemove, setMemberToRemove] = useState(null)
  const [editingMember, setEditingMember] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [memberToView, setMemberToView] = useState(null)
  const [showExportMenu, setShowExportMenu] = useState(false)
  const [memberToEdit, setMemberToEdit] = useState(null)

  // Fetch all members
  const fetchMembers = useCallback(async () => {
    try {
      setLoading(true)
      const membersQuery = query(collection(db, 'users'))
      const snapshot = await getDocs(membersQuery)
      const membersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      
      setMembers(membersData)
      await logAdminActivity('all_members_viewed', { count: membersData.length })
    } catch (error) {
      // console.error('Error fetching members:', error)
      toast.error('Failed to fetch members')
    } finally {
      setLoading(false)
    }
  }, [logAdminActivity])

  useEffect(() => {
    fetchMembers()
  }, [fetchMembers])

  // Open add modal via query param
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    setShowAddModal(params.get('modal') === 'add')
  }, [location.search])

  // Get unique branches and roles
  const uniqueBranches = useMemo(() => {
    return [...new Set(members.map(m => m.branch).filter(Boolean))]
  }, [members])

  const uniqueRoles = useMemo(() => {
    return [...new Set(members.map(m => m.role).filter(Boolean))]
  }, [members])

  // Filter and sort members
  const filteredMembers = useMemo(() => {
    let filtered = [...members]

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(member =>
        member.name?.toLowerCase().includes(query) ||
        member.email?.toLowerCase().includes(query) ||
        member.usn?.toLowerCase().includes(query) ||
        member.phone?.toLowerCase().includes(query)
      )
    }

    // Branch filter
    if (filterBranch !== 'all') {
      filtered = filtered.filter(member => member.branch === filterBranch)
    }

    // Role filter
    if (filterRole !== 'all') {
      filtered = filtered.filter(member => member.role === filterRole)
    }

    // Sorting
    filtered.sort((a, b) => {
      let aVal = a[sortField] || ''
      let bVal = b[sortField] || ''
      
      if (sortField === 'createdAt') {
        aVal = a.createdAt?.seconds || 0
        bVal = b.createdAt?.seconds || 0
      }
      
      return sortOrder === 'asc' 
        ? (aVal > bVal ? 1 : -1)
        : (aVal < bVal ? 1 : -1)
    })

    return filtered
  }, [members, searchQuery, filterBranch, filterRole, sortField, sortOrder])

  // Pagination
  const paginatedMembers = useMemo(() => {
    const start = (currentPage - 1) * MEMBERS_PER_PAGE
    const end = start + MEMBERS_PER_PAGE
    return filteredMembers.slice(start, end)
  }, [filteredMembers, currentPage])

  const totalPages = Math.ceil(filteredMembers.length / MEMBERS_PER_PAGE)

  // Handlers
  const handleSort = useCallback((field) => {
    if (sortField === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortOrder('asc')
    }
  }, [sortField])

  const handleSelectAll = useCallback(() => {
    setSelectAll(!selectAll)
    setSelectedMembers(!selectAll ? paginatedMembers.map(m => m.id) : [])
  }, [selectAll, paginatedMembers])

  const handleSelectMember = useCallback((memberId) => {
    setSelectedMembers(prev =>
      prev.includes(memberId)
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    )
  }, [])

  const updateMember = useCallback(async (memberId, updates) => {
    try {
      await updateDoc(doc(db, 'users', memberId), {
        ...updates,
        updatedAt: new Date()
      })
      
      setMembers(prev => prev.map(member =>
        member.id === memberId ? { ...member, ...updates } : member
      ))
      
      toast.success('Member updated successfully')
      await logAdminActivity('executive_member_updated', { memberId, updates })
      setEditingMember(null)
    } catch (error) {
      // console.error('Error updating member:', error)
      toast.error('Failed to update member')
    }
  }, [logAdminActivity])

  const handleViewDetails = useCallback((member) => {
    setMemberToView(member)
    setShowDetailsModal(true)
  }, [])

  const removeMemberRole = useCallback(async () => {
    if (!memberToRemove) return

    try {
      await updateDoc(doc(db, 'users', memberToRemove.id), {
        role: 'User',
        updatedAt: new Date()
      })
      
      setMembers(prev => prev.filter(member => member.id !== memberToRemove.id))
      toast.success('Member role removed successfully')
      await logAdminActivity('executive_member_role_removed', { memberId: memberToRemove.id })
      
      setShowRemoveModal(false)
      setMemberToRemove(null)
    } catch (error) {
      // console.error('Error removing member role:', error)
      toast.error('Failed to remove member role')
    }
  }, [memberToRemove, logAdminActivity])

  const createMember = useCallback(async (payload) => {
    try {
      const currentUser = auth.currentUser
      if (!currentUser) {
        throw new Error('User not authenticated')
      }
      
      // Validate date
      const birthDate = new Date(payload.dateOfBirth)
      if (isNaN(birthDate.getTime())) {
        throw new Error('Invalid date of birth')
      }

      // Generate unique ID
      const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      
      // Create user document
      const newUser = {
        name: payload.name.trim(),
        email: payload.personalEmail.trim(),
        branch: payload.branch?.trim() || null,
        usn: payload.usn?.trim() || null,
        phone: payload.mobileNumber?.trim() || null,
        year: payload.yearOfStudy || null,
        role: 'EXECUTIVE MEMBER',
        certificates: [],
        createdAt: new Date(),
        updatedAt: new Date()
      }
      
      const userRef = doc(db, 'users', userId)
      await setDoc(userRef, newUser)

      // Create recruit document
      const recruitDoc = {
        name: payload.name.trim(),
        dateOfBirth: Timestamp.fromDate(birthDate),
        usn: payload.usn.trim(),
        yearOfStudy: payload.yearOfStudy.trim(),
        branch: payload.branch.trim(),
        mobileNumber: payload.mobileNumber.trim(),
        personalEmail: payload.personalEmail.trim(),
        collegeEmail: payload.collegeEmail ? payload.collegeEmail.trim() : null,
        membershipPlan: payload.membershipPlan.trim(),
        csiIdea: 'N/A',
        paymentStatus: payload.paymentStatus || 'pending',
        paymentId: payload.paymentId ? payload.paymentId.trim() : null,
        orderId: payload.orderId ? payload.orderId.trim() : null,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      }
      
      await addDoc(collection(db, 'recruits'), recruitDoc)

      setMembers(prev => [{ id: userId, ...newUser, position: 'Executive Member' }, ...prev])
      toast.success('Executive member created successfully')
      await logAdminActivity('executive_member_created', { userId })
      setShowAddModal(false)
    } catch (error) {
      // console.error('Error creating executive member:', error)
      toast.error(`Failed to create executive member: ${error.message}`)
    }
  }, [logAdminActivity])

  const handleExportCSV = useCallback(() => {
    // Debug: Log the first member to see the actual data structure
    if (filteredMembers.length > 0) {
      // console.log('Member data structure:', filteredMembers[0])
    }
    exportMembersToCSV(filteredMembers)
    toast.success('Executive members exported to CSV with all details')
    setShowExportMenu(false)
  }, [filteredMembers])

  const handleExportJSON = useCallback(() => {
    exportMembersToJSON(filteredMembers)
    toast.success('Executive members exported to JSON')
    setShowExportMenu(false)
  }, [filteredMembers])

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1)
    setSelectedMembers([])
    setSelectAll(false)
  }, [searchQuery, filterBranch, filterRole])

  // Loading state
  if (loading) {
    return (
      <div className="p-8">
        <div className="text-center text-gray-500">Loading executive members...</div>
      </div>
    )
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-normal text-[#333]">All Members</h1>
        <p className="text-sm text-gray-600 mt-1">Manage all CSI NMAMIT members</p>
      </div>

      {/* Stats */}
      <div className="bg-white border border-[#ddd] rounded p-4 mb-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <UserCheck className="w-5 h-5 text-[#417690] mr-2" />
            <span className="text-sm font-medium text-[#333]">
              Total Members: {members.length}
            </span>
          </div>
          {uniqueBranches.length > 0 && (
            <div className="text-sm text-gray-600">
              Branches: {uniqueBranches.join(', ')}
            </div>
          )}
          {uniqueRoles.length > 0 && (
            <div className="text-sm text-gray-600">
              Roles: {uniqueRoles.join(', ')}
            </div>
          )}
        </div>
      </div>

      {/* Action Bar */}
      <div className="bg-[#f8f8f8] border border-[#ddd] rounded p-4 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
            {uniqueBranches.length > 0 && (
              <BranchFilter 
                branches={uniqueBranches} 
                value={filterBranch} 
                onChange={setFilterBranch} 
              />
            )}
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="px-3 py-2 border border-[#ccc] rounded text-sm"
            >
              {ROLE_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <button className="px-4 py-2 bg-[#417690] text-white rounded hover:bg-[#205067]">
              <Filter className="inline w-4 h-4 mr-2" />
              Filter
            </button>
          </div>
          <div className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="px-4 py-2 bg-white border border-[#ccc] rounded hover:bg-[#f5f5f5] flex items-center"
            >
              <Download className="w-4 h-4 mr-2" />
              Export All Details
            </button>
            {showExportMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-[#ddd] rounded shadow-lg z-10">
                <button
                  onClick={handleExportCSV}
                  className="w-full px-4 py-2 text-left hover:bg-[#f5f5f5] flex items-center"
                >
                  <FileText className="w-4 h-4 mr-2 text-[#417690]" />
                  Export as CSV
                </button>
                <button
                  onClick={handleExportJSON}
                  className="w-full px-4 py-2 text-left hover:bg-[#f5f5f5] flex items-center border-t border-[#eee]"
                >
                  <FileJson className="w-4 h-4 mr-2 text-[#417690]" />
                  Export as JSON
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="text-sm text-gray-600 mb-2">
        {filteredMembers.length} member{filteredMembers.length !== 1 ? 's' : ''} found
      </div>

      {/* Members Table */}
      <div className="bg-white border border-[#ddd] rounded overflow-hidden">
        <table className="w-full text-sm">
          <TableHeader
            headers={TABLE_HEADERS}
            sortField={sortField}
            sortOrder={sortOrder}
            onSort={handleSort}
            selectAll={selectAll}
            onSelectAll={handleSelectAll}
          />
          <tbody>
            {paginatedMembers.map((member, index) => (
              <MemberRow
                key={member.id}
                member={member}
                index={index}
                isSelected={selectedMembers.includes(member.id)}
                isEditing={editingMember === member.id}
                onSelect={handleSelectMember}
                onEdit={setEditingMember}
                onUpdate={updateMember}
                onRemoveRole={(member) => {
                  setMemberToRemove(member)
                  setShowRemoveModal(true)
                }}
                onViewDetails={handleViewDetails}
                onOpenEdit={setMemberToEdit}
              />
            ))}
          </tbody>
        </table>

        {/* Empty State */}
        {paginatedMembers.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No members found matching your criteria
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-[#f5f5f5] px-4 py-3 flex items-center justify-between border-t border-[#ddd]">
            <div className="text-sm text-gray-600">
              Showing {(currentPage - 1) * MEMBERS_PER_PAGE + 1} to{' '}
              {Math.min(currentPage * MEMBERS_PER_PAGE, filteredMembers.length)} of{' '}
              {filteredMembers.length} members
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>

      {/* Modals */}
      {showRemoveModal && memberToRemove && (
        <RemoveRoleModal
          member={memberToRemove}
          onConfirm={removeMemberRole}
          onCancel={() => {
            setShowRemoveModal(false)
            setMemberToRemove(null)
          }}
        />
      )}

      {showAddModal && (
        <AddMemberModal 
          onClose={() => setShowAddModal(false)} 
          onCreate={createMember} 
        />
      )}

      {showDetailsModal && memberToView && (
        <MemberDetailsModal 
          member={memberToView} 
          onClose={() => {
            setShowDetailsModal(false)
            setMemberToView(null)
          }} 
        />
      )}

      {memberToEdit && (
        <EditMemberModal
          member={memberToEdit}
          onClose={() => setMemberToEdit(null)}
          onSave={async (updates) => {
            await updateMember(memberToEdit.id, updates)
            setMemberToEdit(null)
          }}
        />
      )}
    </div>
  )
}

export default AdminEMembers
