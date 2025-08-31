// Date formatting utilities
export const formatDate = (timestamp) => {
  if (!timestamp?.seconds) return '-'
  return new Date(timestamp.seconds * 1000).toLocaleDateString()
}

export const formatTimestamp = (timestamp) => {
  if (!timestamp) return '-'
  if (timestamp?.seconds) {
    return new Date(timestamp.seconds * 1000).toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short',
      timeZone: 'Asia/Kolkata'
    })
  }
  if (timestamp?.toDate) {
    return timestamp.toDate().toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short',
      timeZone: 'Asia/Kolkata'
    })
  }
  return '-'
}

// Currency formatting
export const formatCurrency = (amount) => {
  if (!amount) return '-'
  return `₹${amount}`
}

// CSS class helpers
export const getRowClassName = (index, isSelected) => {
  const base = 'border-b border-[#eee] hover:bg-[#ffffcc]'
  if (isSelected) return `${base} bg-[#ffffe0]`
  return index % 2 === 0 ? `${base} bg-white` : `${base} bg-[#fcfcfc]`
}

// CSV export utility with ALL details - properly handling all fields
export const exportMembersToCSV = (members) => {
  console.log('Exporting members to CSV. Sample member:', members[0])
  
  // Comprehensive headers including all fields
  const headers = [
    'Name',
    'Email', 
    'Phone',
    'USN',
    'Branch',
    'Year',
    'Position',
    'Role',
    'Bio',
    'GitHub',
    'LinkedIn',
    'Membership Type',
    'Membership Start Date',
    'Membership End Date',
    'Payment Amount',
    'Platform Fee', 
    'Total Amount',
    'Currency',
    'Payment Date',
    'Payment Status',
    'Razorpay Order ID',
    'Razorpay Payment ID',
    'Certificates Count',
    'Account Status',
    'Member Since',
    'Last Updated',
    'User ID'
  ]
  
  // Process each member's data
  const rows = []
  
  members.forEach(member => {
    // Log to debug data structure
    console.log('Processing member:', member.name, 'Payment Details:', member.paymentDetails)
    
    // Build row data - ensure every field is extracted properly
    const rowData = []
    
    // Basic Information
    rowData.push(member.name || '-')
    rowData.push(member.email || '-')
    rowData.push(member.phone || '-')
    rowData.push(member.usn || '-')
    rowData.push(member.branch || '-')
    rowData.push(member.year || member.yearOfStudy || '-')
    rowData.push(member.position || 'Executive Member')
    rowData.push(member.role || 'EXECUTIVE MEMBER')
    
    // Social Information
    rowData.push(member.bio || '-')
    rowData.push(member.github || '-')
    rowData.push(member.linkedin || '-')
    
    // Membership Information
    rowData.push(member.membershipType || '-')
    rowData.push(member.membershipStartDate ? formatTimestamp(member.membershipStartDate) : '-')
    rowData.push(member.membershipEndDate ? formatTimestamp(member.membershipEndDate) : '-')
    
    // Payment Information - check if paymentDetails exists
    if (member.paymentDetails) {
      rowData.push(member.paymentDetails.amount || '-')
      rowData.push(member.paymentDetails.platformFee || '-')
      rowData.push(member.paymentDetails.totalAmount || '-')
      rowData.push(member.paymentDetails.currency || 'INR')
      rowData.push(member.paymentDetails.paymentDate ? formatTimestamp(member.paymentDetails.paymentDate) : '-')
      rowData.push(member.paymentStatus || 'Completed')
      rowData.push(member.paymentDetails.razorpayOrderId || '-')
      rowData.push(member.paymentDetails.razorpayPaymentId || '-')
    } else {
      // No payment details - fill with defaults
      rowData.push('-') // amount
      rowData.push('-') // platform fee
      rowData.push('-') // total amount
      rowData.push('INR') // currency
      rowData.push('-') // payment date
      rowData.push(member.paymentStatus || '-') // payment status
      rowData.push('-') // razorpay order id
      rowData.push('-') // razorpay payment id
    }
    
    // Additional Information
    rowData.push(member.certificates?.length || '0')
    rowData.push(member.status || 'Active')
    rowData.push(member.createdAt ? formatTimestamp(member.createdAt) : '-')
    rowData.push(member.updatedAt ? formatTimestamp(member.updatedAt) : '-')
    rowData.push(member.id || '-')
    
    // Add the row
    rows.push(rowData)
  })
  
  // Build CSV content
  let csvContent = ''
  
  // Add headers
  csvContent += headers.map(h => `"${h}"`).join(',') + '\r\n'
  
  // Add data rows
  rows.forEach(row => {
    const processedRow = row.map(cell => {
      // Convert to string and handle special characters
      const cellStr = String(cell || '-')
      // Escape quotes and wrap in quotes
      return `"${cellStr.replace(/"/g, '""')}"`
    })
    csvContent += processedRow.join(',') + '\r\n'
  })
  
  // Log final CSV for debugging
  console.log('CSV Content (first 500 chars):', csvContent.substring(0, 500))
  
  // Create and download file
  const BOM = '\uFEFF' // UTF-8 BOM for Excel
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8' })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `executive_members_full_details_${new Date().toISOString().split('T')[0]}.csv`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  
  // Clean up
  setTimeout(() => window.URL.revokeObjectURL(url), 100)
}

// Export detailed member data as JSON
export const exportMembersToJSON = (members) => {
  const dataStr = JSON.stringify(members, null, 2)
  const blob = new Blob([dataStr], { type: 'application/json' })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `executive_members_full_details_${new Date().toISOString().split('T')[0]}.json`
  link.click()
  window.URL.revokeObjectURL(url)
}

// Form validation
export const validateMemberForm = (form) => {
  const errors = {}
  if (!form.name?.trim()) errors.name = 'Name is required'
  if (!form.personalEmail?.trim()) errors.personalEmail = 'Personal email is required'
  if (!form.usn?.trim()) errors.usn = 'USN is required'
  if (!form.branch?.trim()) errors.branch = 'Branch is required'
  if (!form.yearOfStudy?.trim()) errors.yearOfStudy = 'Year of study is required'
  if (!form.mobileNumber?.trim()) errors.mobileNumber = 'Mobile number is required'
  if (!form.dateOfBirth) errors.dateOfBirth = 'Date of birth is required'
  if (!form.membershipPlan?.trim()) errors.membershipPlan = 'Membership plan is required'
  return errors
}
