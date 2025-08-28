import { useState, useEffect, useCallback, useMemo } from 'react'
import { useAdminAuth } from '../../contexts/AdminAuthContext'
import {
  Search,
  Filter,
  Download,
  Trash2,
  ChevronLeft,
  ChevronRight,
  UserCheck,
} from 'lucide-react'
import {
  collection,
  query,
  getDocs,
  doc,
  updateDoc,
  orderBy,
  where
} from 'firebase/firestore'
import { db } from '../../config/firebase'
import toast from 'react-hot-toast'

// Constants
const MEMBERS_PER_PAGE = 20
const TABLE_HEADERS = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'email', label: 'Email', sortable: true },
  { key: 'usn', label: 'USN', sortable: false },
  { key: 'branch', label: 'Branch', sortable: false },
  { key: 'year', label: 'Year', sortable: false },
  { key: 'phone', label: 'Phone', sortable: false },
  { key: 'position', label: 'Position', sortable: false },
  { key: 'createdAt', label: 'Joined', sortable: true },
]

// Utility functions
const formatDate = (timestamp) => {
  if (!timestamp?.seconds) return '-'
  return new Date(timestamp.seconds * 1000).toLocaleDateString()
}

const getRowClassName = (index, isSelected) => {
  const base = 'border-b border-[#eee] hover:bg-[#ffffcc]'
  if (isSelected) return `${base} bg-[#ffffe0]`
  return index % 2 === 0 ? `${base} bg-white` : `${base} bg-[#fcfcfc]`
}

// Components
const SearchBar = ({ value, onChange }) => (
  <div className="relative">
    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Search executive members..."
      className="pl-10 pr-4 py-2 border border-[#ccc] rounded bg-white focus:outline-none focus:border-[#79aec8] w-64"
    />
  </div>
)

const BranchFilter = ({ branches, value, onChange }) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="px-3 py-2 border border-[#ccc] rounded bg-white focus:outline-none focus:border-[#79aec8]"
  >
    <option value="all">All Branches</option>
    {branches.map(branch => (
      <option key={branch} value={branch}>{branch}</option>
    ))}
  </select>
)

const TableHeader = ({ headers, sortField, sortOrder, onSort, selectAll, onSelectAll }) => (
  <thead className="bg-[#f5f5f5] border-b border-[#ddd]">
    <tr>
      <th className="px-4 py-2 text-left">
        <input
          type="checkbox"
          checked={selectAll}
          onChange={onSelectAll}
          className="rounded border-gray-300"
        />
      </th>
      {headers.map(({ key, label, sortable }) => (
        <th
          key={key}
          className={`px-4 py-2 text-left font-normal text-[#666] ${
            sortable ? 'cursor-pointer hover:text-[#333]' : ''
          }`}
          onClick={sortable ? () => onSort(key) : undefined}
        >
          {label} {sortable && sortField === key && (sortOrder === 'asc' ? '↑' : '↓')}
        </th>
      ))}
      <th className="px-4 py-2 text-left font-normal text-[#666]">Actions</th>
    </tr>
  </thead>
)

const MemberRow = ({ member, index, isSelected, isEditing, onSelect, onEdit, onUpdate, onRemoveRole }) => (
  <tr className={getRowClassName(index, isSelected)}>
    <td className="px-4 py-2">
      <input
        type="checkbox"
        checked={isSelected}
        onChange={() => onSelect(member.id)}
        className="rounded border-gray-300"
      />
    </td>
    <td className="px-4 py-2">
      {isEditing ? (
        <input
          type="text"
          defaultValue={member.name}
          onBlur={(e) => onUpdate(member.id, { name: e.target.value })}
          className="px-2 py-1 border border-[#ccc] rounded"
          autoFocus
        />
      ) : (
        <button
          onClick={() => onEdit(member.id)}
          className="text-[#417690] hover:text-[#205067] font-medium text-left"
        >
          {member.name || 'Unnamed Member'}
        </button>
      )}
    </td>
    <td className="px-4 py-2 text-gray-600">
      <a href={`mailto:${member.email}`} className="hover:text-[#417690]">
        {member.email}
      </a>
    </td>
    <td className="px-4 py-2 text-gray-600">{member.usn || '-'}</td>
    <td className="px-4 py-2 text-gray-600">{member.branch || '-'}</td>
    <td className="px-4 py-2 text-gray-600">{member.year || '-'}</td>
    <td className="px-4 py-2 text-gray-600">
      {member.phone ? (
        <a href={`tel:${member.phone}`} className="hover:text-[#417690]">
          {member.phone}
        </a>
      ) : '-'}
    </td>
    <td className="px-4 py-2">
      <span className="inline-block px-2 py-1 text-xs rounded bg-green-100 text-green-800">
        {member.position || 'Executive Member'}
      </span>
    </td>
    <td className="px-4 py-2 text-gray-600">{formatDate(member.createdAt)}</td>
    <td className="px-4 py-2">
      <button
        onClick={() => onRemoveRole(member)}
        className="text-[#ba2121] hover:text-[#8a1919]"
        title="Remove Executive Role"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </td>
  </tr>
)

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const renderButtons = () => {
    const buttons = []
    const maxButtons = 5
    
    let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2))
    let endPage = Math.min(totalPages, startPage + maxButtons - 1)
    
    if (endPage - startPage < maxButtons - 1) {
      startPage = Math.max(1, endPage - maxButtons + 1)
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={`px-3 py-1 border rounded ${
            currentPage === i
              ? 'bg-[#417690] text-white border-[#417690]'
              : 'bg-white border-[#ccc] hover:bg-[#f5f5f5]'
          }`}
        >
          {i}
        </button>
      )
    }
    return buttons
  }

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
        disabled={currentPage === 1}
        className="px-3 py-1 border border-[#ccc] rounded bg-white hover:bg-[#f5f5f5] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      {renderButtons()}
      <button
        onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
        disabled={currentPage === totalPages}
        className="px-3 py-1 border border-[#ccc] rounded bg-white hover:bg-[#f5f5f5] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  )
}

const RemoveRoleModal = ({ member, onConfirm, onCancel }) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded p-6 max-w-md w-full">
      <h2 className="text-lg font-semibold text-[#333] mb-4">Remove Executive Member Role</h2>
      <p className="text-gray-600 mb-6">
        Are you sure you want to remove the executive member role from "{member?.name || member?.email}"? 
        They will become a regular user.
      </p>
      <div className="flex items-center justify-end space-x-3">
        <button
          onClick={onCancel}
          className="px-4 py-2 border border-[#ccc] rounded hover:bg-[#f5f5f5]"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="px-4 py-2 bg-[#ba2121] text-white rounded hover:bg-[#8a1919]"
        >
          Yes, Remove Role
        </button>
      </div>
    </div>
  </div>
)

// Main Component
const AdminEMembers = () => {
  const { logAdminActivity } = useAdminAuth()
  
  // State
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterBranch, setFilterBranch] = useState('all')
  const [selectedMembers, setSelectedMembers] = useState([])
  const [selectAll, setSelectAll] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [sortField, setSortField] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState('desc')
  const [showRemoveModal, setShowRemoveModal] = useState(false)
  const [memberToRemove, setMemberToRemove] = useState(null)
  const [editingMember, setEditingMember] = useState(null)

  // Fetch executive members
  const fetchMembers = useCallback(async () => {
    try {
      setLoading(true)
      const membersQuery = query(
        collection(db, 'users'),
        where('role', '==', 'EXECUTIVE MEMBER')
      )
      const snapshot = await getDocs(membersQuery)
      const membersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      
      setMembers(membersData)
      await logAdminActivity('executive_members_viewed', { count: membersData.length })
    } catch (error) {
      console.error('Error fetching executive members:', error)
      toast.error('Failed to fetch executive members')
    } finally {
      setLoading(false)
    }
  }, [logAdminActivity])

  useEffect(() => {
    fetchMembers()
  }, [])

  // Get unique branches
  const uniqueBranches = useMemo(() => {
    return [...new Set(members.map(m => m.branch).filter(Boolean))]
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
  }, [members, searchQuery, filterBranch, sortField, sortOrder])

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
      console.error('Error updating member:', error)
      toast.error('Failed to update member')
    }
  }, [logAdminActivity])

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
      console.error('Error removing member role:', error)
      toast.error('Failed to remove member role')
    }
  }, [memberToRemove, logAdminActivity])

  const exportToCSV = useCallback(() => {
    const headers = ['Name', 'Email', 'USN', 'Branch', 'Year', 'Phone', 'Position', 'Joined Date']
    const csvData = filteredMembers.map(member => [
      member.name || '',
      member.email || '',
      member.usn || '',
      member.branch || '',
      member.year || '',
      member.phone || '',
      member.position || 'Executive Member',
      formatDate(member.createdAt)
    ])

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `executive_members_${new Date().toISOString().split('T')[0]}.csv`
    link.click()
    
    toast.success('Executive members exported successfully')
  }, [filteredMembers])

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1)
    setSelectedMembers([])
    setSelectAll(false)
  }, [searchQuery, filterBranch])

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
        <h1 className="text-2xl font-normal text-[#333]">Executive Members</h1>
        <p className="text-sm text-gray-600 mt-1">Manage CSI NMAMIT executive committee members</p>
      </div>

      {/* Stats */}
      <div className="bg-white border border-[#ddd] rounded p-4 mb-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <UserCheck className="w-5 h-5 text-[#417690] mr-2" />
            <span className="text-sm font-medium text-[#333]">
              Total Executive Members: {members.length}
            </span>
          </div>
          {uniqueBranches.length > 0 && (
            <div className="text-sm text-gray-600">
              Branches: {uniqueBranches.join(', ')}
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
            <button className="px-4 py-2 bg-[#417690] text-white rounded hover:bg-[#205067]">
              <Filter className="inline w-4 h-4 mr-2" />
              Filter
            </button>
          </div>
          <button
            onClick={exportToCSV}
            className="px-4 py-2 bg-white border border-[#ccc] rounded hover:bg-[#f5f5f5]"
          >
            <Download className="inline w-4 h-4 mr-2" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Results Summary */}
      <div className="text-sm text-gray-600 mb-2">
        {filteredMembers.length} executive member{filteredMembers.length !== 1 ? 's' : ''} found
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
                onRemoveRole={setMemberToRemove}
              />
            ))}
          </tbody>
        </table>

        {/* Empty State */}
        {paginatedMembers.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No executive members found matching your criteria
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

      {/* Remove Role Modal */}
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
    </div>
  )
}

export default AdminEMembers
