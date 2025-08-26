import { Download, CreditCard } from 'lucide-react'
import toast from 'react-hot-toast'

const QuickActions = () => {
  const downloadCertificate = () => {
    // Implement certificate download logic
    toast.success('Certificate download started!')
  }

  const manageMembership = () => {
    // Implement membership management logic
    console.log('Manage membership')
  }

  return (
    <div className="glass-card rounded-xl p-6 mt-6">
      <h3 className="font-semibold mb-4">Quick Actions</h3>
      <div className="space-y-2">
        <button
          onClick={downloadCertificate}
          className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <span className="flex items-center gap-2">
            <Download size={18} />
            Download Certificate
          </span>
        </button>
        <button 
          onClick={manageMembership}
          className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <span className="flex items-center gap-2">
            <CreditCard size={18} />
            Manage Membership
          </span>
        </button>
      </div>
    </div>
  )
}

export default QuickActions
