import { useState } from 'react'
import { PAYMENT_STATUS_OPTIONS, YEAR_OPTIONS } from '../utils/constants'

const EditMemberModal = ({ member, onClose, onSave }) => {
  const [form, setForm] = useState({
    name: member.name || '',
    email: member.email || '',
    phone: member.phone || '',
    usn: member.usn || '',
    branch: member.branch || '',
    year: member.year || '',
    paymentStatus: member.paymentStatus || 'pending',
    paymentId: member.paymentDetails?.razorpayPaymentId || member.paymentId || '',
    orderId: member.paymentDetails?.razorpayOrderId || member.orderId || ''
  })

  const setField = (key, value) => setForm(prev => ({ ...prev, [key]: value }))

  const labelClass = 'block text-xs font-medium text-gray-600 mb-1'
  const inputClass = 'w-full px-3 py-2 border border-[#ddd] rounded focus:outline-none focus:ring-1 focus:ring-[#417690]'

  const handleSubmit = async (e) => {
    e.preventDefault()
    const updates = {
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim() || null,
      usn: form.usn.trim() || null,
      branch: form.branch.trim() || null,
      year: form.year || null,
      paymentStatus: form.paymentStatus || null,
    }

    // Map payment IDs into a backward-compatible shape
    if (form.paymentId || form.orderId) {
      updates.paymentDetails = {
        ...(member.paymentDetails || {}),
        razorpayPaymentId: form.paymentId || null,
        razorpayOrderId: form.orderId || null
      }
    }

    await onSave(updates)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-2xl rounded shadow-lg">
        <div className="px-5 py-3 border-b border-[#eee] flex items-center justify-between">
          <h3 className="text-[#333] text-lg">Edit Member</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-[#333]">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Name</label>
              <input className={inputClass} value={form.name} onChange={(e) => setField('name', e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Email</label>
              <input className={inputClass} value={form.email} onChange={(e) => setField('email', e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Phone</label>
              <input className={inputClass} value={form.phone} onChange={(e) => setField('phone', e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>USN</label>
              <input className={inputClass} value={form.usn} onChange={(e) => setField('usn', e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Branch</label>
              <input className={inputClass} value={form.branch} onChange={(e) => setField('branch', e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Year</label>
              <select className={inputClass} value={form.year} onChange={(e) => setField('year', e.target.value)}>
                <option value="">Select</option>
                {YEAR_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="pt-2 border-t border-[#eee]">
            <h4 className="text-sm text-[#333] mb-3">Payment</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className={labelClass}>Payment Status</label>
                <select className={inputClass} value={form.paymentStatus} onChange={(e) => setField('paymentStatus', e.target.value)}>
                  {PAYMENT_STATUS_OPTIONS.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Razorpay Payment ID</label>
                <input className={inputClass} value={form.paymentId} onChange={(e) => setField('paymentId', e.target.value)} placeholder="pay_..." />
              </div>
              <div>
                <label className={labelClass}>Razorpay Order ID</label>
                <input className={inputClass} value={form.orderId} onChange={(e) => setField('orderId', e.target.value)} placeholder="order_..." />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end space-x-2 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 border border-[#ccc] rounded bg-white hover:bg-[#f5f5f5]">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded bg-[#417690] text-white hover:bg-[#205067]">Save</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditMemberModal


