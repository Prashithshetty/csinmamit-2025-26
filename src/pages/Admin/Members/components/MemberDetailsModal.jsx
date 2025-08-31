import { formatTimestamp, formatCurrency } from '../utils/helpers'

const DetailRow = ({ label, value, isHighlighted = false }) => (
  <div className={`py-2 px-3 ${isHighlighted ? 'bg-[#f0f8ff]' : ''}`}>
    <div className="text-xs text-gray-500 mb-1">{label}</div>
    <div className="text-sm text-[#333] font-medium">{value || '-'}</div>
  </div>
)

const SectionTitle = ({ title }) => (
  <h3 className="text-sm font-semibold text-[#333] bg-[#f5f5f5] px-3 py-2 border-b border-[#ddd]">
    {title}
  </h3>
)

const MemberDetailsModal = ({ member, onClose }) => {
  if (!member) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-[#417690] text-white p-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">{member.name || 'Member Details'}</h2>
            <p className="text-sm opacity-90 mt-1">{member.role || 'EXECUTIVE MEMBER'}</p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 p-2 rounded transition-colors"
            title="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
          {/* Basic Information */}
          <SectionTitle title="Basic Information" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-b border-[#eee]">
            <DetailRow label="Full Name" value={member.name} isHighlighted />
            <DetailRow label="Email" value={member.email} />
            <DetailRow label="Phone" value={member.phone} isHighlighted />
            <DetailRow label="USN" value={member.usn} />
            <DetailRow label="Branch" value={member.branch} isHighlighted />
            <DetailRow label="Year of Study" value={member.year || member.yearOfStudy} />
            <DetailRow label="Position" value={member.position || 'Executive Member'} isHighlighted />
            <DetailRow label="Bio" value={member.bio} />
            <DetailRow label="GitHub" value={member.github} isHighlighted />
            <DetailRow label="LinkedIn" value={member.linkedin} />
          </div>

          {/* Membership Information */}
          <SectionTitle title="Membership Information" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-b border-[#eee]">
            <DetailRow label="Membership Type" value={member.membershipType} isHighlighted />
            <DetailRow label="Membership Start Date" value={formatTimestamp(member.membershipStartDate)} />
            <DetailRow label="Membership End Date" value={formatTimestamp(member.membershipEndDate)} isHighlighted />
            <DetailRow label="Member Since" value={formatTimestamp(member.createdAt)} />
            <DetailRow label="Last Updated" value={formatTimestamp(member.updatedAt)} isHighlighted />
          </div>

          {/* Payment Details */}
          {member.paymentDetails && (
            <>
              <SectionTitle title="Payment Information" />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-b border-[#eee]">
                <DetailRow 
                  label="Amount Paid" 
                  value={formatCurrency(member.paymentDetails?.amount)} 
                  isHighlighted 
                />
                <DetailRow 
                  label="Platform Fee" 
                  value={formatCurrency(member.paymentDetails?.platformFee)} 
                />
                <DetailRow 
                  label="Total Amount" 
                  value={formatCurrency(member.paymentDetails?.totalAmount)} 
                  isHighlighted 
                />
                <DetailRow 
                  label="Currency" 
                  value={member.paymentDetails?.currency} 
                />
                <DetailRow 
                  label="Payment Date" 
                  value={formatTimestamp(member.paymentDetails?.paymentDate)} 
                  isHighlighted 
                />
                <DetailRow 
                  label="Payment Status" 
                  value={member.paymentStatus || 'Completed'} 
                />
                <DetailRow 
                  label="Razorpay Order ID" 
                  value={member.paymentDetails?.razorpayOrderId} 
                  isHighlighted 
                />
                <DetailRow 
                  label="Razorpay Payment ID" 
                  value={member.paymentDetails?.razorpayPaymentId} 
                />
              </div>
            </>
          )}

          {/* Additional Information */}
          <SectionTitle title="Additional Information" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-b border-[#eee]">
            <DetailRow label="User ID" value={member.id} isHighlighted />
            <DetailRow label="Certificates Count" value={member.certificates?.length || 0} />
            <DetailRow label="Account Status" value={member.status || 'Active'} isHighlighted />
          </div>

          {/* Raw Data (for debugging) */}
          {process.env.NODE_ENV === 'development' && (
            <>
              <SectionTitle title="Raw Data (Development Only)" />
              <div className="p-3 bg-[#f5f5f5]">
                <pre className="text-xs overflow-x-auto">
                  {JSON.stringify(member, null, 2)}
                </pre>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="bg-[#f5f5f5] px-4 py-3 border-t border-[#ddd] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#417690] text-white rounded hover:bg-[#205067] transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default MemberDetailsModal
