import { useState, useEffect } from 'react'
import { useAdminAuth } from '../../contexts/AdminAuthContext'
import { 
  Users, 
  Calendar, 
  CreditCard, 
  UserCheck,
  Plus,
  Edit,
  Eye,
  Trash2
} from 'lucide-react'
import { 
  collection, 
  query, 
  getDocs, 
  orderBy, 
  limit,
  where
} from 'firebase/firestore'
import { db } from '../../config/firebase'
import { useNavigate } from 'react-router-dom'

const AdminDashboard = () => {
  const { adminUser, logAdminActivity } = useAdminAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeMembers: 0,
    totalEvents: 0,
    totalRevenue: 0
  })
  const [recentUsers, setRecentUsers] = useState([])
  const [recentEvents, setRecentEvents] = useState([])
  const [loading, setLoading] = useState(true)

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      
      // Fetch users
      const usersQuery = query(collection(db, 'users'), orderBy('joinedAt', 'desc'), limit(5))
      const usersSnapshot = await getDocs(usersQuery)
      const users = usersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setRecentUsers(users)
      
      // Fetch total users count
      const allUsersQuery = query(collection(db, 'users'))
      const allUsersSnapshot = await getDocs(allUsersQuery)
      const totalUsers = allUsersSnapshot.size
      
      // Fetch active members
      const membersQuery = query(
        collection(db, 'users'),
        where('membership.status', '==', 'active')
      )
      const membersSnapshot = await getDocs(membersQuery)
      const activeMembers = membersSnapshot.size
      
      // Fetch events
      const eventsQuery = query(collection(db, 'events'), orderBy('createdAt', 'desc'), limit(5))
      const eventsSnapshot = await getDocs(eventsQuery)
      const events = eventsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setRecentEvents(events)
      
      // Fetch total events count
      const allEventsQuery = query(collection(db, 'events'))
      const allEventsSnapshot = await getDocs(allEventsQuery)
      const totalEvents = allEventsSnapshot.size
      
      const totalRevenue = activeMembers * 500 // Assuming ₹500 per membership
      
      setStats({
        totalUsers,
        activeMembers,
        totalEvents,
        totalRevenue
      })
      
      // Log activity
      await logAdminActivity('dashboard_viewed', { timestamp: new Date() })
      
    } catch (error) {
      // console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-center text-gray-500">Loading...</div>
      </div>
    )
  }

  return (
    <div className="p-8">
      {/* Page Title */}
      <h1 className="text-2xl font-normal text-[#333] mb-6">Site administration</h1>

      {/* Django-style Content Blocks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Authentication and Authorization Block */}
        <div className="bg-white border border-[#ddd] rounded">
          <div className="bg-[#79aec8] text-white px-4 py-2">
            <h2 className="text-sm font-semibold uppercase">Authentication and Authorization</h2>
          </div>
          <div className="p-4">
            <table className="w-full">
              <tbody>
                <tr className="border-b border-[#eee] hover:bg-[#f5f5f5]">
                  <td className="py-3">
                    <a href="/admin/users" className="text-[#417690] hover:text-[#205067] font-medium">
                      Users
                    </a>
                  </td>
                  <td className="py-3 text-right space-x-3">
                    <button 
                      onClick={() => navigate('/admin/users')}
                      className="text-[#417690] hover:text-[#205067] text-sm"
                    >
                      <Plus className="inline w-4 h-4 mr-1" />
                      Add
                    </button>
                    <button 
                      onClick={() => navigate('/admin/users')}
                      className="text-[#417690] hover:text-[#205067] text-sm"
                    >
                      Change
                    </button>
                  </td>
                </tr>
                <tr className="hover:bg-[#f5f5f5]">
                  <td className="py-3">
                    <a href="/admin/groups" className="text-[#417690] hover:text-[#205067] font-medium">
                      Groups
                    </a>
                  </td>
                  <td className="py-3 text-right space-x-3">
                    <button className="text-[#417690] hover:text-[#205067] text-sm">
                      <Plus className="inline w-4 h-4 mr-1" />
                      Add
                    </button>
                    <button className="text-[#417690] hover:text-[#205067] text-sm">
                      Change
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Content Management Block */}
        <div className="bg-white border border-[#ddd] rounded">
          <div className="bg-[#79aec8] text-white px-4 py-2">
            <h2 className="text-sm font-semibold uppercase">Content Management</h2>
          </div>
          <div className="p-4">
            <table className="w-full">
              <tbody>
                <tr className="border-b border-[#eee] hover:bg-[#f5f5f5]">
                  <td className="py-3">
                    <a href="/admin/events" className="text-[#417690] hover:text-[#205067] font-medium">
                      Events
                    </a>
                  </td>
                  <td className="py-3 text-right space-x-3">
                    <button className="text-[#417690] hover:text-[#205067] text-sm">
                      <Plus className="inline w-4 h-4 mr-1" />
                      Add
                    </button>
                    <button className="text-[#417690] hover:text-[#205067] text-sm">
                      Change
                    </button>
                  </td>
                </tr>
                <tr className="border-b border-[#eee] hover:bg-[#f5f5f5]">
                  <td className="py-3">
                    <a href="/admin/members" className="text-[#417690] hover:text-[#205067] font-medium">
                      Members
                    </a>
                  </td>
                  <td className="py-3 text-right space-x-3">
                    <button className="text-[#417690] hover:text-[#205067] text-sm">
                      <Plus className="inline w-4 h-4 mr-1" />
                      Add
                    </button>
                    <button className="text-[#417690] hover:text-[#205067] text-sm">
                      Change
                    </button>
                  </td>
                </tr>
                <tr className="hover:bg-[#f5f5f5]">
                  <td className="py-3">
                    <a href="/admin/payments" className="text-[#417690] hover:text-[#205067] font-medium">
                      Payments
                    </a>
                  </td>
                  <td className="py-3 text-right space-x-3">
                    <button className="text-[#417690] hover:text-[#205067] text-sm">
                      <Plus className="inline w-4 h-4 mr-1" />
                      Add
                    </button>
                    <button className="text-[#417690] hover:text-[#205067] text-sm">
                      Change
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Statistics Block */}
        <div className="bg-white border border-[#ddd] rounded">
          <div className="bg-[#79aec8] text-white px-4 py-2">
            <h2 className="text-sm font-semibold uppercase">Quick Statistics</h2>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-[#f8f8f8] rounded">
                <div className="text-3xl font-bold text-[#417690]">{stats.totalUsers}</div>
                <div className="text-sm text-gray-600 mt-1">Total Users</div>
              </div>
              <div className="text-center p-4 bg-[#f8f8f8] rounded">
                <div className="text-3xl font-bold text-[#417690]">{stats.activeMembers}</div>
                <div className="text-sm text-gray-600 mt-1">Active Members</div>
              </div>
              <div className="text-center p-4 bg-[#f8f8f8] rounded">
                <div className="text-3xl font-bold text-[#417690]">{stats.totalEvents}</div>
                <div className="text-sm text-gray-600 mt-1">Total Events</div>
              </div>
              <div className="text-center p-4 bg-[#f8f8f8] rounded">
                <div className="text-3xl font-bold text-[#417690]">₹{stats.totalRevenue}</div>
                <div className="text-sm text-gray-600 mt-1">Total Revenue</div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Actions Block */}
        <div className="bg-white border border-[#ddd] rounded">
          <div className="bg-[#79aec8] text-white px-4 py-2">
            <h2 className="text-sm font-semibold uppercase">Recent Actions</h2>
          </div>
          <div className="p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">My Actions</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center justify-between py-1">
                <span className="text-gray-600">No recent actions</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Recent Items Tables */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recent Users */}
        <div className="bg-white border border-[#ddd] rounded">
          <div className="bg-[#f5f5f5] px-4 py-2 border-b border-[#ddd]">
            <h3 className="text-sm font-semibold text-[#333]">Recent Users</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#f8f8f8] border-b border-[#ddd]">
                <tr>
                  <th className="text-left px-4 py-2 font-normal text-[#666]">Name</th>
                  <th className="text-left px-4 py-2 font-normal text-[#666]">Email</th>
                  <th className="text-left px-4 py-2 font-normal text-[#666]">Status</th>
                  <th className="text-left px-4 py-2 font-normal text-[#666]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentUsers.map((user, index) => (
                  <tr key={user.id} className={`border-b border-[#eee] hover:bg-[#f5f5f5] ${index % 2 === 0 ? 'bg-white' : 'bg-[#fcfcfc]'}`}>
                    <td className="px-4 py-2">
                      <a href={`/admin/users/${user.id}`} className="text-[#417690] hover:text-[#205067]">
                        {user.name || 'Unnamed User'}
                      </a>
                    </td>
                    <td className="px-4 py-2 text-gray-600">{user.email}</td>
                    <td className="px-4 py-2">
                      <span className={`inline-block px-2 py-1 text-xs rounded ${
                        user.membership?.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {user.membership?.status || 'inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      <button className="text-[#417690] hover:text-[#205067] mr-2">
                        <Edit className="w-4 h-4 inline" />
                      </button>
                      <button className="text-[#ba2121] hover:text-[#8a1919]">
                        <Trash2 className="w-4 h-4 inline" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Events */}
        <div className="bg-white border border-[#ddd] rounded">
          <div className="bg-[#f5f5f5] px-4 py-2 border-b border-[#ddd]">
            <h3 className="text-sm font-semibold text-[#333]">Recent Events</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#f8f8f8] border-b border-[#ddd]">
                <tr>
                  <th className="text-left px-4 py-2 font-normal text-[#666]">Title</th>
                  <th className="text-left px-4 py-2 font-normal text-[#666]">Date</th>
                  <th className="text-left px-4 py-2 font-normal text-[#666]">Status</th>
                  <th className="text-left px-4 py-2 font-normal text-[#666]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentEvents.length > 0 ? recentEvents.map((event, index) => (
                  <tr key={event.id} className={`border-b border-[#eee] hover:bg-[#f5f5f5] ${index % 2 === 0 ? 'bg-white' : 'bg-[#fcfcfc]'}`}>
                    <td className="px-4 py-2">
                      <a href={`/admin/events/${event.id}`} className="text-[#417690] hover:text-[#205067]">
                        {event.title || 'Untitled Event'}
                      </a>
                    </td>
                    <td className="px-4 py-2 text-gray-600">
                      {event.date ? new Date(event.date).toLocaleDateString() : 'No date'}
                    </td>
                    <td className="px-4 py-2">
                      <span className={`inline-block px-2 py-1 text-xs rounded ${
                        event.status === 'published' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {event.status || 'draft'}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      <button className="text-[#417690] hover:text-[#205067] mr-2">
                        <Edit className="w-4 h-4 inline" />
                      </button>
                      <button className="text-[#ba2121] hover:text-[#8a1919]">
                        <Trash2 className="w-4 h-4 inline" />
                      </button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="4" className="px-4 py-4 text-center text-gray-500">
                      No events found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
