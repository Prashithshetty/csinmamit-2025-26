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
} from 'lucide-react'
import {
  collection,
  query,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore'
import { db } from '../../config/firebase'
import toast from 'react-hot-toast'

// Constants
const USERS_PER_PAGE = 20
const ROLES = ['User', 'EXECUTIVE MEMBER', 'member', 'core', 'admin']
const TABLE_HEADERS = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'email', label: 'Email', sortable: true },
  { key: 'usn', label: 'USN', sortable: false },
  { key: 'branch', label: 'Branch', sortable: false },
  { key: 'role', label: 'Role', sortable: false },
  { key: 'createdAt', label: 'Joined', sortable: true },
]

// Utility functions
const formatDate = (timestamp) => {
  if (!timestamp?.seconds) return '-'
  return new Date(timestamp.seconds * 1000).toLocaleDateString()
}

const formatDateTime = (timestamp) => {
  if (!timestamp?.seconds) return '-'
  return new Date(timestamp.seconds * 1000).toLocaleString()
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
      placeholder="Search users..."
      className="pl-10 pr-4 py-2 border border-[#ccc] rounded bg-white focus:outline-none focus:border-[#79aec8] w-64"
    />
  </div>
)

const RoleFilter = ({ value, onChange }) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="px-3 py-2 border border-[#ccc] rounded bg-white focus:outline-none focus:border-[#79aec8]"
  >
    <option value="all">All Roles</option>
    {ROLES.map(role => (
      <option key={role} value={role}>{role}</option>
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

const UserRow = ({ user, index, isSelected, isEditing, onSelect, onEdit, onUpdate, onDelete }) => (
  <tr className={getRowClassName(index, isSelected)}>
    <td className="px-4 py-2">
      <input
        type="checkbox"
        checked={isSelected}
        onChange={() => onSelect(user.id)}
        className="rounded border-gray-300"
      />
    </td>
    <td className="px-4 py-2">
      {isEditing ? (
        <input
          type="text"
          defaultValue={user.name}
          onBlur={(e) => onUpdate(user.id, { name: e.target.value })}
          className="px-2 py-1 border border-[#ccc] rounded"
          autoFocus
        />
      ) : (
        <button
          onClick={() => onEdit(user.id)}
          className="text-[#417690] hover:text-[#205067] font-medium text-left"
        >
          {user.name || 'Unnamed User'}
        </button>
      )}
    </td>
    <td className="px-4 py-2">
      <div className="text-gray-800">{user.email}</div>
      <div className="text-xs text-gray-500">Created: {formatDateTime(user.createdAt)}</div>
    </td>
    <td className="px-4 py-2 text-gray-600">{user.usn || '-'}</td>
    <td className="px-4 py-2 text-gray-600">{user.branch || '-'}</td>
    <td className="px-4 py-2">
      <select
        value={user.role || 'User'}
        onChange={(e) => onUpdate(user.id, { role: e.target.value })}
        className="px-2 py-1 border border-[#ccc] rounded text-xs"
      >
        {ROLES.map(role => (
          <option key={role} value={role}>{role}</option>
        ))}
      </select>
    </td>
    <td className="px-4 py-2 text-gray-600">{formatDateTime(user.createdAt)}</td>
    <td className="px-4 py-2">
      <button
        onClick={() => onDelete(user)}
        className="text-[#ba2121] hover:text-[#8a1919]"
        title="Delete User"
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

const DeleteModal = ({ user, onConfirm, onCancel }) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded p-6 max-w-md w-full">
      <h2 className="text-lg font-semibold text-[#333] mb-4">Confirm Deletion</h2>
      <p className="text-gray-600 mb-6">
        Are you sure you want to delete user "{user?.name || user?.email}"? 
        This action cannot be undone.
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
          Delete User
        </button>
      </div>
    </div>
  </div>
)

const AddUserModal = ({ onClose, onCreate }) => {
  const [form, setForm] = useState({ name: '', email: '', role: 'User', usn: '', branch: '' })
  const [submitting, setSubmitting] = useState(false)
  
  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name?.trim() || !form.email?.trim()) {
      toast.error('Name and Email are required')
      return
    }
    setSubmitting(true)
    await onCreate(form)
    setSubmitting(false)
  }
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded p-6 max-w-md w-full">
        <h2 className="text-lg font-semibold text-[#333] mb-4">Add User</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input name="name" value={form.name} onChange={handleChange} placeholder="Name" className="w-full px-3 py-2 border border-[#ccc] rounded" />
          <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Email" className="w-full px-3 py-2 border border-[#ccc] rounded" />
          <div className="flex gap-2">
            <input name="usn" value={form.usn} onChange={handleChange} placeholder="USN" className="flex-1 px-3 py-2 border border-[#ccc] rounded" />
            <input name="branch" value={form.branch} onChange={handleChange} placeholder="Branch" className="flex-1 px-3 py-2 border border-[#ccc] rounded" />
          </div>
          <select name="role" value={form.role} onChange={handleChange} className="w-full px-3 py-2 border border-[#ccc] rounded">
            {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 border border-[#ccc] rounded hover:bg-[#f5f5f5]">Cancel</button>
            <button disabled={submitting} type="submit" className="px-4 py-2 bg-[#417690] text-white rounded hover:bg-[#205067]">
              {submitting ? 'Creating...' : 'Create User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Main Component
const AdminUsers = () => {
  const { logAdminActivity } = useAdminAuth()
  const location = useLocation()
  
  // State
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterRole, setFilterRole] = useState('all')
  const [selectedUsers, setSelectedUsers] = useState([])
  const [selectAll, setSelectAll] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [sortField, setSortField] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState('desc')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [userToDelete, setUserToDelete] = useState(null)
  const [editingUser, setEditingUser] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)

  // Fetch users (fetch ALL docs without constraints)
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true)
      const usersSnapshot = await getDocs(collection(db, 'users'))
      const usersData = usersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      
      setUsers(usersData)
      await logAdminActivity('users_viewed', { count: usersData.length })
    } catch (error) {
      console.error('Error fetching users:', error.message)
      toast.error('Failed to fetch users')
    } finally {
      setLoading(false)
    }
  }, [logAdminActivity])

  useEffect(() => {
    fetchUsers()
  }, [])

  // Open add modal via query param ?modal=add
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    setShowAddModal(params.get('modal') === 'add')
  }, [location.search])

  // Filter and sort users
  const filteredUsers = useMemo(() => {
    let filtered = [...users]

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(user =>
        user.name?.toLowerCase().includes(query) ||
        user.email?.toLowerCase().includes(query) ||
        user.usn?.toLowerCase().includes(query) ||
        user.branch?.toLowerCase().includes(query)
      )
    }

    // Role filter
    if (filterRole !== 'all') {
      filtered = filtered.filter(user => user.role === filterRole)
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
  }, [users, searchQuery, filterRole, sortField, sortOrder])

  // Show ALL users (no pagination)
  const paginatedUsers = useMemo(() => {
    return filteredUsers
  }, [filteredUsers])

  const totalPages = 1

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
    setSelectedUsers(!selectAll ? filteredUsers.map(u => u.id) : [])
  }, [selectAll, filteredUsers])

  const handleSelectUser = useCallback((userId) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    )
  }, [])

  const updateUser = useCallback(async (userId, updates) => {
    try {
      await updateDoc(doc(db, 'users', userId), {
        ...updates,
        updatedAt: new Date()
      })
      
      setUsers(prev => prev.map(user =>
        user.id === userId ? { ...user, ...updates } : user
      ))
      
      toast.success('User updated successfully')
      await logAdminActivity('user_updated', { userId, updates })
      setEditingUser(null)
    } catch (error) {
      console.error('Error updating user:', error)
      toast.error('Failed to update user')
    }
  }, [logAdminActivity])

  const deleteUser = useCallback(async () => {
    if (!userToDelete) return

    try {
      await deleteDoc(doc(db, 'users', userToDelete.id))
      setUsers(prev => prev.filter(user => user.id !== userToDelete.id))
      
      toast.success('User deleted successfully')
      await logAdminActivity('user_deleted', { userId: userToDelete.id })
      
      setShowDeleteModal(false)
      setUserToDelete(null)
    } catch (error) {
      console.error('Error deleting user:', error)
      toast.error('Failed to delete user')
    }
  }, [userToDelete, logAdminActivity])

  const createUser = useCallback(async (payload) => {
    try {
      // Comply with rules: allowed keys only, createdAt/updatedAt timestamps
      const newUser = {
        name: payload.name.trim(),
        branch: payload.branch?.trim() || null,
        usn: payload.usn?.trim() || null,
        role: payload.role || 'User',
        certificates: [],
        createdAt: new Date(),
        updatedAt: new Date()
      }
      // Email not allowed on create; set via merge update after
      const { addDoc, collection, doc, updateDoc } = await import('firebase/firestore')
      const { db } = await import('../../config/firebase')
      const docRef = await addDoc(collection(db, 'users'), newUser)
      await updateDoc(doc(db, 'users', docRef.id), { email: payload.email.trim(), updatedAt: new Date() })

      setUsers(prev => [{ id: docRef.id, ...newUser, email: payload.email.trim() }, ...prev])
      toast.success('User created successfully')
      await logAdminActivity('user_created', { userId: docRef.id })
      setShowAddModal(false)
    } catch (error) {
      toast.error('Failed to create user')
    }
  }, [logAdminActivity])

  const exportToCSV = useCallback(() => {
    const headers = ['Name', 'Email', 'Role', 'USN', 'Branch', 'Year', 'Phone', 'Joined At']
    const csvData = filteredUsers.map(user => [
      user.name || '',
      user.email || '',
      user.role || 'User',
      user.usn || '',
      user.branch || '',
      user.year || '',
      user.phone || '',
      formatDateTime(user.createdAt)
    ])

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `users_${new Date().toISOString().split('T')[0]}.csv`
    link.click()
    
    toast.success('Users exported successfully')
  }, [filteredUsers])

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1)
    setSelectedUsers([])
    setSelectAll(false)
  }, [searchQuery, filterRole])

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-center text-gray-500">Loading users...</div>
      </div>
    )
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-normal text-[#333]">User Management</h1>
        <p className="text-sm text-gray-600 mt-1">Manage all registered users</p>
      </div>

      {/* Action Bar */}
      <div className="bg-[#f8f8f8] border border-[#ddd] rounded p-4 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
            <RoleFilter value={filterRole} onChange={setFilterRole} />
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
        {filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''} found
      </div>

      {/* Users Table */}
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
            {paginatedUsers.map((user, index) => (
              <UserRow
                key={user.id}
                user={user}
                index={index}
                isSelected={selectedUsers.includes(user.id)}
                isEditing={editingUser === user.id}
                onSelect={handleSelectUser}
                onEdit={setEditingUser}
                onUpdate={updateUser}
                onDelete={setUserToDelete}
              />
            ))}
          </tbody>
        </table>

        {/* Empty State */}
        {paginatedUsers.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No users found matching your criteria
          </div>
        )}

        {/* Pagination (hidden when totalPages <= 1) */}
        {totalPages > 1 && (
          <div className="bg-[#f5f5f5] px-4 py-3 flex items-center justify-between border-t border-[#ddd]">
            <div className="text-sm text-gray-600">
              Showing {(currentPage - 1) * USERS_PER_PAGE + 1} to{' '}
              {Math.min(currentPage * USERS_PER_PAGE, filteredUsers.length)} of{' '}
              {filteredUsers.length} users
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>

      {/* Delete Modal */}
      {showDeleteModal && userToDelete && (
        <DeleteModal
          user={userToDelete}
          onConfirm={deleteUser}
          onCancel={() => {
            setShowDeleteModal(false)
            setUserToDelete(null)
          }}
        />
      )}

      {/* Add User Modal */}
      {showAddModal && (
        <AddUserModal onClose={() => setShowAddModal(false)} onCreate={createUser} />
      )}
    </div>
  )
}

export default AdminUsers