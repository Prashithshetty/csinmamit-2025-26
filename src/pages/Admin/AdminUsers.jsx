import { useState, useEffect } from 'react'
import { useAdminAuth } from '../../contexts/AdminAuthContext'
import {
  Search,
  Filter,
  Download,
  Plus,
  Edit,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
  Check,
  X
} from 'lucide-react'
import {
  collection,
  query,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  orderBy,
  where
} from 'firebase/firestore'
import { db } from '../../config/firebase'
import toast from 'react-hot-toast'

const AdminUsers = () => {
  const { logAdminActivity } = useAdminAuth()
  const [users, setUsers] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterRole, setFilterRole] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedUsers, setSelectedUsers] = useState([])
  const [selectAll, setSelectAll] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [usersPerPage] = useState(20)
  const [sortField, setSortField] = useState('joinedAt')
  const [sortOrder, setSortOrder] = useState('desc')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [userToDelete, setUserToDelete] = useState(null)
  const [editingUser, setEditingUser] = useState(null)

  // Fetch users from Firestore
  const fetchUsers = async () => {
    try {
      setLoading(true)
      const usersQuery = query(collection(db, 'users'), orderBy('joinedAt', 'desc'))
      const snapshot = await getDocs(usersQuery)
      const usersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setUsers(usersData)
      setFilteredUsers(usersData)
      
      await logAdminActivity('users_viewed', { count: usersData.length })
    } catch (error) {
      console.error('Error fetching users:', error)
      toast.error('Failed to fetch users')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  // Filter users
  useEffect(() => {
    let filtered = [...users]

    if (searchQuery) {
      filtered = filtered.filter(user =>
        user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.profile?.college?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (filterRole !== 'all') {
      filtered = filtered.filter(user => user.role === filterRole)
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(user => user.membership?.status === filterStatus)
    }

    // Sort
    filtered.sort((a, b) => {
      let aVal = a[sortField] || ''
      let bVal = b[sortField] || ''
      
      if (sortField === 'joinedAt') {
        aVal = a.joinedAt?.seconds || 0
        bVal = b.joinedAt?.seconds || 0
      }
      
      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1
      } else {
        return aVal < bVal ? 1 : -1
      }
    })

    setFilteredUsers(filtered)
    setCurrentPage(1)
    setSelectedUsers([])
    setSelectAll(false)
  }, [searchQuery, filterRole, filterStatus, users, sortField, sortOrder])

  // Pagination
  const indexOfLastUser = currentPage * usersPerPage
  const indexOfFirstUser = indexOfLastUser - usersPerPage
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser)
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage)

  // Handle select all
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedUsers([])
    } else {
      setSelectedUsers(currentUsers.map(u => u.id))
    }
    setSelectAll(!selectAll)
  }

  // Handle individual select
  const handleSelectUser = (userId) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter(id => id !== userId))
    } else {
      setSelectedUsers([...selectedUsers, userId])
    }
  }

  // Update user
  const updateUser = async (userId, updates) => {
    try {
      const userRef = doc(db, 'users', userId)
      await updateDoc(userRef, updates)
      
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
  }

  // Delete user
  const deleteUser = async () => {
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
  }

  // Bulk delete
  const bulkDelete = async () => {
    if (selectedUsers.length === 0) return
    
    if (!confirm(`Are you sure you want to delete ${selectedUsers.length} users?`)) return

    try {
      for (const userId of selectedUsers) {
        await deleteDoc(doc(db, 'users', userId))
      }
      setUsers(prev => prev.filter(user => !selectedUsers.includes(user.id)))
      toast.success(`${selectedUsers.length} users deleted successfully`)
      setSelectedUsers([])
      setSelectAll(false)
    } catch (error) {
      console.error('Error deleting users:', error)
      toast.error('Failed to delete users')
    }
  }

  // Export to CSV
  const exportToCSV = () => {
    const headers = ['Name', 'Email', 'Role', 'College', 'Branch', 'Year', 'Membership Status', 'Joined Date']
    const csvData = filteredUsers.map(user => [
      user.name || '',
      user.email || '',
      user.role || 'member',
      user.profile?.college || '',
      user.profile?.branch || '',
      user.profile?.year || '',
      user.membership?.status || 'inactive',
      user.joinedAt ? new Date(user.joinedAt.seconds * 1000).toLocaleDateString() : ''
    ])

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `users_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    
    toast.success('Users exported successfully')
  }

  // Handle sort
  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortOrder('asc')
    }
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-center text-gray-500">Loading...</div>
      </div>
    )
  }

  return (
    <div className="p-8">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-normal text-[#333]">Select user to change</h1>
      </div>

      {/* Action Bar */}
      <div className="bg-[#f8f8f8] border border-[#ddd] rounded p-4 mb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search users..."
                className="pl-10 pr-4 py-2 border border-[#ccc] rounded bg-white focus:outline-none focus:border-[#79aec8] w-64"
              />
            </div>

            {/* Filters */}
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="px-3 py-2 border border-[#ccc] rounded bg-white focus:outline-none focus:border-[#79aec8]"
            >
              <option value="all">All Roles</option>
              <option value="member">Members</option>
              <option value="admin">Admins</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-[#ccc] rounded bg-white focus:outline-none focus:border-[#79aec8]"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

            <button className="px-4 py-2 bg-[#417690] text-white rounded hover:bg-[#205067]">
              <Filter className="inline w-4 h-4 mr-2" />
              Filter
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => navigate('/admin/users/add')}
              className="px-4 py-2 bg-[#417690] text-white rounded hover:bg-[#205067]"
            >
              <Plus className="inline w-4 h-4 mr-2" />
              Add user
            </button>
            <button
              onClick={exportToCSV}
              className="px-4 py-2 bg-white border border-[#ccc] rounded hover:bg-[#f5f5f5]"
            >
              <Download className="inline w-4 h-4 mr-2" />
              Export
            </button>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedUsers.length > 0 && (
          <div className="flex items-center space-x-4 pt-4 border-t border-[#ddd]">
            <span className="text-sm text-gray-600">
              {selectedUsers.length} of {filteredUsers.length} selected
            </span>
            <select className="px-3 py-1 border border-[#ccc] rounded bg-white text-sm">
              <option value="">Action</option>
              <option value="delete">Delete selected users</option>
              <option value="activate">Activate membership</option>
              <option value="deactivate">Deactivate membership</option>
            </select>
            <button
              onClick={bulkDelete}
              className="px-3 py-1 bg-[#ba2121] text-white rounded text-sm hover:bg-[#8a1919]"
            >
              Go
            </button>
          </div>
        )}
      </div>

      {/* Results Summary */}
      <div className="text-sm text-gray-600 mb-2">
        {filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''}
      </div>

      {/* Users Table */}
      <div className="bg-white border border-[#ddd] rounded overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[#f5f5f5] border-b border-[#ddd]">
            <tr>
              <th className="px-4 py-2 text-left">
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={handleSelectAll}
                  className="rounded border-gray-300"
                />
              </th>
              <th 
                className="px-4 py-2 text-left font-normal text-[#666] cursor-pointer hover:text-[#333]"
                onClick={() => handleSort('name')}
              >
                Name {sortField === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th 
                className="px-4 py-2 text-left font-normal text-[#666] cursor-pointer hover:text-[#333]"
                onClick={() => handleSort('email')}
              >
                Email {sortField === 'email' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th className="px-4 py-2 text-left font-normal text-[#666]">College</th>
              <th className="px-4 py-2 text-left font-normal text-[#666]">Role</th>
              <th className="px-4 py-2 text-left font-normal text-[#666]">Status</th>
              <th 
                className="px-4 py-2 text-left font-normal text-[#666] cursor-pointer hover:text-[#333]"
                onClick={() => handleSort('joinedAt')}
              >
                Joined {sortField === 'joinedAt' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th className="px-4 py-2 text-left font-normal text-[#666]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((user, index) => (
              <tr 
                key={user.id} 
                className={`border-b border-[#eee] hover:bg-[#ffffcc] ${
                  selectedUsers.includes(user.id) ? 'bg-[#ffffe0]' : 
                  index % 2 === 0 ? 'bg-white' : 'bg-[#fcfcfc]'
                }`}
              >
                <td className="px-4 py-2">
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(user.id)}
                    onChange={() => handleSelectUser(user.id)}
                    className="rounded border-gray-300"
                  />
                </td>
                <td className="px-4 py-2">
                  {editingUser === user.id ? (
                    <input
                      type="text"
                      defaultValue={user.name}
                      onBlur={(e) => updateUser(user.id, { name: e.target.value })}
                      className="px-2 py-1 border border-[#ccc] rounded"
                      autoFocus
                    />
                  ) : (
                    <a 
                      href="#" 
                      onClick={(e) => {
                        e.preventDefault()
                        setEditingUser(user.id)
                      }}
                      className="text-[#417690] hover:text-[#205067] font-medium"
                    >
                      {user.name || 'Unnamed User'}
                    </a>
                  )}
                </td>
                <td className="px-4 py-2 text-gray-600">{user.email}</td>
                <td className="px-4 py-2 text-gray-600">
                  {user.profile?.college || '-'}
                </td>
                <td className="px-4 py-2">
                  <select
                    value={user.role || 'member'}
                    onChange={(e) => updateUser(user.id, { role: e.target.value })}
                    className="px-2 py-1 border border-[#ccc] rounded text-xs"
                  >
                    <option value="member">Member</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td className="px-4 py-2">
                  <span className={`inline-block px-2 py-1 text-xs rounded ${
                    user.membership?.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {user.membership?.status || 'inactive'}
                  </span>
                </td>
                <td className="px-4 py-2 text-gray-600">
                  {user.joinedAt 
                    ? new Date(user.joinedAt.seconds * 1000).toLocaleDateString()
                    : '-'}
                </td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => {
                      setUserToDelete(user)
                      setShowDeleteModal(true)
                    }}
                    className="text-[#ba2121] hover:text-[#8a1919]"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-[#f5f5f5] px-4 py-3 flex items-center justify-between border-t border-[#ddd]">
            <div className="text-sm text-gray-600">
              Showing {indexOfFirstUser + 1} to {Math.min(indexOfLastUser, filteredUsers.length)} of {filteredUsers.length} users
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-[#ccc] rounded bg-white hover:bg-[#f5f5f5] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              {[...Array(Math.min(5, totalPages))].map((_, index) => {
                let pageNum
                if (totalPages <= 5) {
                  pageNum = index + 1
                } else if (currentPage <= 3) {
                  pageNum = index + 1
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + index
                } else {
                  pageNum = currentPage - 2 + index
                }
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-3 py-1 border rounded ${
                      currentPage === pageNum
                        ? 'bg-[#417690] text-white border-[#417690]'
                        : 'bg-white border-[#ccc] hover:bg-[#f5f5f5]'
                    }`}
                  >
                    {pageNum}
                  </button>
                )
              })}
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border border-[#ccc] rounded bg-white hover:bg-[#f5f5f5] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded p-6 max-w-md w-full">
            <h2 className="text-lg font-semibold text-[#333] mb-4">Delete user</h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "{userToDelete?.name || userToDelete?.email}"? 
              This action cannot be undone.
            </p>
            <div className="flex items-center justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border border-[#ccc] rounded hover:bg-[#f5f5f5]"
              >
                Cancel
              </button>
              <button
                onClick={deleteUser}
                className="px-4 py-2 bg-[#ba2121] text-white rounded hover:bg-[#8a1919]"
              >
                Yes, I'm sure
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminUsers
