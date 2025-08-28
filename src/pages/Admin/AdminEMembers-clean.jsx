import { useState, useEffect, useCallback, useMemo } from 'react'
import { useLocation } from 'react-router-dom'
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

const AddMemberModal = ({ onClose, onCreate }) => {
  const [form, setForm] = useState({
    name: '',
    personalEmail: '',
    collegeEmail: '',
    usn: '',
    branch: '',
    yearOfStudy: '',
    mobileNumber: '',
    dateOfBirth: '',
    membershipPlan: '',
    paymentStatus: 'pending',
    paymentId: '',
    orderId: ''
  })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  const setField = (name, value) => {
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: undefined }))
  }

  const validate = () => {
    const newErrors = {}
    if (!form.name?.trim()) newErrors.name = 'Name is required'
    if (!form.personalEmail?.trim()) newErrors.personalEmail = 'Personal email is required'
    if (!form.usn?.trim()) newErrors.usn = 'USN is required'
    if (!form.branch?.trim()) newErrors.branch = 'Branch is required'
    if (!form.yearOfStudy?.trim()) newErrors.yearOfStudy = 'Year of study is required'
    if (!form.mobileNumber?.trim()) newErrors.mobileNumber = 'Mobile number is required'
    if (!form.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required'
    if (!form.membershipPlan?.trim()) newErrors.membershipPlan = 'Membership plan is required'
    // CSI Idea is not required
    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = validate()
    if (Object.keys(newErrors).length) {
      setErrors(newErrors)
      toast.error('Please correct the highlighted fields')
      return
    }
    setSubmitting(true)
    await onCreate(form)
    setSubmitting(false)
  }

  const labelClass = 'block text-sm text-[#333] mb-1'
  const inputClass = (hasError) => `w-full px-3 py-2 border ${hasError ? 'border-[#ba2121]' : 'border-[#ccc]'} rounded bg-white focus:outline-none focus:border-[#79aec8]`
  const sectionClass = 'border border-[#eee] rounded p-3 bg-[#fafafa]'
  const hintClass = 'text-xs text-gray-500'

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded sm:rounded p-4 sm:p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-semibold text-[#333] mb-4">Add Executive Member</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Personal Information */}
          <div className={sectionClass}>
            <h3 className="text-sm font-medium text-[#333] mb-3">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Full Name<span className="text-[#ba2121]">*</span></label>
                <input name="name" value={form.name} onChange={(e) => setField('name', e.target.value)} className={inputClass(errors.name)} placeholder="John Doe" />
                {errors.name && <div className="text-xs text-[#ba2121] mt-1">{errors.name}</div>}
              </div>
              <div>
                <label className={labelClass}>Date of Birth<span className="text-[#ba2121]">*</span></label>
                <input name="dateOfBirth" type="date" value={form.dateOfBirth} onChange={(e) => setField('dateOfBirth', e.target.value)} className={inputClass(errors.dateOfBirth)} />
                {errors.dateOfBirth && <div className="text-xs text-[#ba2121] mt-1">{errors.dateOfBirth}</div>}
              </div>
              <div>
                <label className={labelClass}>Personal Email<span className="text-[#ba2121]">*</span></label>
                <input name="personalEmail" type="email" value={form.personalEmail} onChange={(e) => setField('personalEmail', e.target.value)} className={inputClass(errors.personalEmail)} placeholder="name@example.com" />
                {errors.personalEmail && <div className="text-xs text-[#ba2121] mt-1">{errors.personalEmail}</div>}
              </div>
              <div>
                <label className={labelClass}>College Email</label>
                <input name="collegeEmail" type="email" value={form.collegeEmail} onChange={(e) => setField('collegeEmail', e.target.value)} className={inputClass(false)} placeholder="name@college.com" />
                <div className={hintClass}>Optional</div>
              </div>
              <div>
                <label className={labelClass}>Mobile Number<span className="text-[#ba2121]">*</span></label>
                <input name="mobileNumber" value={form.mobileNumber} onChange={(e) => setField('mobileNumber', e.target.value)} className={inputClass(errors.mobileNumber)} placeholder="10-20 digits" maxLength={20} />
                {errors.mobileNumber && <div className="text-xs text-[#ba2121] mt-1">{errors.mobileNumber}</div>}
              </div>
            </div>
          </div>

          {/* Academic Information */}
          <div className={sectionClass}>
            <h3 className="text-sm font-medium text-[#333] mb-3">Academic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className={labelClass}>USN<span className="text-[#ba2121]">*</span></label>
                <input name="usn" value={form.usn} onChange={(e) => setField('usn', e.target.value.toUpperCase())} className={inputClass(errors.usn)} placeholder="e.g., 2K21CS001" />
                {errors.usn && <div className="text-xs text-[#ba2121] mt-1">{errors.usn}</div>}
              </div>
              <div>
                <label className={labelClass}>Branch<span className="text-[#ba2121]">*</span></label>
                <input name="branch" value={form.branch} onChange={(e) => setField('branch', e.target.value)} className={inputClass(errors.branch)} placeholder="CSE / ECE / ..." />
                {errors.branch && <div className="text-xs text-[#ba2121] mt-1">{errors.branch}</div>}
              </div>
              <div>
                <label className={labelClass}>Year of Study<span className="text-[#ba2121]">*</span></label>
                <select name="yearOfStudy" value={form.yearOfStudy} onChange={(e) => setField('yearOfStudy', e.target.value)} className={inputClass(errors.yearOfStudy)}>
                  <option value="">Select year</option>
                  <option value="First">First</option>
                  <option value="Second">Second</option>
                  <option value="Third">Third</option>
                  <option value="Fourth">Fourth</option>
                  <option value="Other">Other</option>
                </select>
                {errors.yearOfStudy && <div className="text-xs text-[#ba2121] mt-1">{errors.yearOfStudy}</div>}
              </div>
            </div>
          </div>

          {/* Membership */}
          <div className={sectionClass}>
            <h3 className="text-sm font-medium text-[#333] mb-3">Membership Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Membership Plan (Amount)<span className="text-[#ba2121]">*</span></label>
                <select name="membershipPlan" value={form.membershipPlan} onChange={(e) => setField('membershipPlan', e.target.value)} className={inputClass(errors.membershipPlan)}>
                  <option value="">Select plan</option>
                  <option value="350">350</option>
                  <option value="650">650</option>
                  <option value="900">900</option>
                </select>
                {errors.membershipPlan && <div className="text-xs text-[#ba2121] mt-1">{errors.membershipPlan}</div>}
              </div>
              <div>
                <label className={labelClass}>Payment Status</label>
                <select name="paymentStatus" value={form.paymentStatus} onChange={(e) => setField('paymentStatus', e.target.value)} className={inputClass(false)}>
                  <option value="pending">pending</option>
                  <option value="completed">completed</option>
                  <option value="failed">failed</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Payment ID</label>
                <input name="paymentId" value={form.paymentId} onChange={(e) => setField('paymentId', e.target.value)} className={inputClass(false)} placeholder="Optional" />
              </div>
              <div>
                <label className={labelClass}>Order ID</label>
                <input name="orderId" value={form.orderId} onChange={(e) => setField('orderId', e.target.value)} className={inputClass(false)} placeholder="Optional" />
              </div>
            </div>
          </div>



          <div className="flex justify-end gap-2 pt-1">
            <button type="button" onClick={onClose} className="px-4 py-2 border border-[#ccc] rounded hover:bg-[#f5f5f5]">Cancel</button>
            <button disabled={submitting} type="submit" className="px-4 py-2 bg-[#417690] text-white rounded hover:bg-[#205067]">
              {submitting ? 'Creating...' : 'Create Member'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Main Component
const AdminEMembers = () => {
  const { logAdminActivity } = useAdminAuth()
  const location = useLocation()
  
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
  const [showAddModal, setShowAddModal] = useState(false)

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

  // Open add modal via query param ?modal=add
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    setShowAddModal(params.get('modal') === 'add')
  }, [location.search])

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

  const createMember = useCallback(async (payload) => {
    try {
      const { addDoc, collection, doc, updateDoc, setDoc, serverTimestamp, Timestamp } = await import('firebase/firestore')
      const { db } = await import('../../config/firebase')
      const { auth } = await import('../../config/firebase')
      
      // Check if user is authenticated
      const currentUser = auth.currentUser
      console.log('Current user:', currentUser?.uid, currentUser?.email)
      
      if (!currentUser) {
        throw new Error('User not authenticated')
      }
      
      // Check if admin document exists
      const { getDoc } = await import('firebase/firestore')
      const adminRef = doc(db, 'admins', currentUser.uid)
      const adminDoc = await getDoc(adminRef)
      console.log('Admin document exists:', adminDoc.exists(), adminDoc.data())
      
      if (!adminDoc.exists()) {
        console.warn('Admin document does not exist in admins collection')
      }
      
      // Validate date before creating timestamp
      const birthDate = new Date(payload.dateOfBirth)
      if (isNaN(birthDate.getTime())) {
        throw new Error('Invalid date of birth')
      }

      // Create a new user with EXECUTIVE MEMBER role first
      // Generate a unique ID for the user
      const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      
      const newUser = {
        name: payload.name.trim(),
        branch: payload.branch?.trim() || null,
        usn: payload.usn?.trim() || null,
        phone: payload.mobileNumber?.trim() || null,
        year: payload.yearOfStudy ? Number(payload.yearOfStudy) : null,
        role: 'EXECUTIVE MEMBER',
        certificates: [],
        createdAt: new Date(),
        updatedAt: new Date()
      }
      
      console.log('Creating user document with ID:', userId)
      const userRef = doc(db, 'users', userId)
      await setDoc(userRef, { ...newUser, email: payload.personalEmail.trim() })
      console.log('User document created:', userId)

      // Create recruit application (this should work with authenticated user)
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
        csiIdea: 'N/A', // Default value since field is not required
        paymentStatus: payload.paymentStatus || 'pending',
        paymentId: payload.paymentId ? payload.paymentId.trim() : null,
        orderId: payload.orderId ? payload.orderId.trim() : null,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      }
      
      console.log('Creating recruit document:', recruitDoc)
      const recruitRef = await addDoc(collection(db, 'recruits'), recruitDoc)
      console.log('Recruit document created:', recruitRef.id)

      setMembers(prev => [{ id: userId, ...newUser, email: payload.personalEmail.trim(), position: 'Executive Member' }, ...prev])
      toast.success('Executive member created successfully')
      await logAdminActivity('executive_member_created', { userId: userId, recruitId: recruitRef.id })
      setShowAddModal(false)
    } catch (error) {
      console.error('Error creating executive member:', error.message)
      toast.error(`Failed to create executive member: ${error}`)
    }
  }, [logAdminActivity])

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

      {/* Add Member Modal */}
      {showAddModal && (
        <AddMemberModal onClose={() => setShowAddModal(false)} onCreate={createMember} />
      )}
    </div>
  )
}

export default AdminEMembers
