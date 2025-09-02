import { useState } from 'react'
import toast from 'react-hot-toast'
import { validateMemberForm } from '../utils/helpers'
import { YEAR_OPTIONS, MEMBERSHIP_PLANS, PAYMENT_STATUS_OPTIONS } from '../utils/constants'

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

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = validateMemberForm(form)
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
                <input 
                  name="name" 
                  value={form.name} 
                  onChange={(e) => setField('name', e.target.value)} 
                  className={inputClass(errors.name)} 
                  placeholder="John Doe" 
                />
                {errors.name && <div className="text-xs text-[#ba2121] mt-1">{errors.name}</div>}
              </div>
              <div>
                <label className={labelClass}>Date of Birth<span className="text-[#ba2121]">*</span></label>
                <input 
                  name="dateOfBirth" 
                  type="date" 
                  value={form.dateOfBirth} 
                  onChange={(e) => setField('dateOfBirth', e.target.value)} 
                  className={inputClass(errors.dateOfBirth)} 
                />
                {errors.dateOfBirth && <div className="text-xs text-[#ba2121] mt-1">{errors.dateOfBirth}</div>}
              </div>
              <div>
                <label className={labelClass}>Personal Email<span className="text-[#ba2121]">*</span></label>
                <input 
                  name="personalEmail" 
                  type="email" 
                  value={form.personalEmail} 
                  onChange={(e) => setField('personalEmail', e.target.value)} 
                  className={inputClass(errors.personalEmail)} 
                  placeholder="name@example.com" 
                />
                {errors.personalEmail && <div className="text-xs text-[#ba2121] mt-1">{errors.personalEmail}</div>}
              </div>
              <div>
                <label className={labelClass}>College Email</label>
                <input 
                  name="collegeEmail" 
                  type="email" 
                  value={form.collegeEmail} 
                  onChange={(e) => setField('collegeEmail', e.target.value)} 
                  className={inputClass(false)} 
                  placeholder="name@college.com" 
                />
                <div className={hintClass}>Optional</div>
              </div>
              <div>
                <label className={labelClass}>Mobile Number<span className="text-[#ba2121]">*</span></label>
                <input 
                  name="mobileNumber" 
                  value={form.mobileNumber} 
                  onChange={(e) => setField('mobileNumber', e.target.value)} 
                  className={inputClass(errors.mobileNumber)} 
                  placeholder="10-20 digits" 
                  maxLength={20} 
                />
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
                <input 
                  name="usn" 
                  value={form.usn} 
                  onChange={(e) => setField('usn', e.target.value.toUpperCase())} 
                  className={inputClass(errors.usn)} 
                  placeholder="e.g., 2K21CS001" 
                />
                {errors.usn && <div className="text-xs text-[#ba2121] mt-1">{errors.usn}</div>}
              </div>
              <div>
                <label className={labelClass}>Branch<span className="text-[#ba2121]">*</span></label>
                <input 
                  name="branch" 
                  value={form.branch} 
                  onChange={(e) => setField('branch', e.target.value)} 
                  className={inputClass(errors.branch)} 
                  placeholder="CSE / ECE / ..." 
                />
                {errors.branch && <div className="text-xs text-[#ba2121] mt-1">{errors.branch}</div>}
              </div>
              <div>
                <label className={labelClass}>Year of Study<span className="text-[#ba2121]">*</span></label>
                <select 
                  name="yearOfStudy" 
                  value={form.yearOfStudy} 
                  onChange={(e) => setField('yearOfStudy', e.target.value)} 
                  className={inputClass(errors.yearOfStudy)}
                >
                  <option value="">Select year</option>
                  {YEAR_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
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
                <select 
                  name="membershipPlan" 
                  value={form.membershipPlan} 
                  onChange={(e) => setField('membershipPlan', e.target.value)} 
                  className={inputClass(errors.membershipPlan)}
                >
                  <option value="">Select plan</option>
                  {MEMBERSHIP_PLANS.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
                {errors.membershipPlan && <div className="text-xs text-[#ba2121] mt-1">{errors.membershipPlan}</div>}
              </div>
              <div>
                <label className={labelClass}>Payment Status</label>
                <select 
                  name="paymentStatus" 
                  value={form.paymentStatus} 
                  onChange={(e) => setField('paymentStatus', e.target.value)} 
                  className={inputClass(false)}
                >
                  {PAYMENT_STATUS_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Payment ID</label>
                <input 
                  name="paymentId" 
                  value={form.paymentId} 
                  onChange={(e) => setField('paymentId', e.target.value)} 
                  className={inputClass(false)} 
                  placeholder="Optional" 
                />
              </div>
              <div>
                <label className={labelClass}>Order ID</label>
                <input 
                  name="orderId" 
                  value={form.orderId} 
                  onChange={(e) => setField('orderId', e.target.value)} 
                  className={inputClass(false)} 
                  placeholder="Optional" 
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-4 py-2 border border-[#ccc] rounded hover:bg-[#f5f5f5]"
            >
              Cancel
            </button>
            <button 
              disabled={submitting} 
              type="submit" 
              className="px-4 py-2 bg-[#417690] text-white rounded hover:bg-[#205067] disabled:opacity-50"
            >
              {submitting ? 'Creating...' : 'Create Member'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddMemberModal
