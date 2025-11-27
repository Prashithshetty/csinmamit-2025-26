// Table configuration
export const MEMBERS_PER_PAGE = 20

export const TABLE_HEADERS = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'email', label: 'Email', sortable: true },
  { key: 'usn', label: 'USN', sortable: false },
  { key: 'branch', label: 'Branch', sortable: false },
  { key: 'year', label: 'Year', sortable: false },
  { key: 'phone', label: 'Phone', sortable: false },
  { key: 'role', label: 'Role', sortable: true },
  { key: 'createdAt', label: 'Joined', sortable: true },
]

export const ROLE_OPTIONS = [
  { value: 'all', label: 'All Roles' },
  { value: 'EXECUTIVE MEMBER', label: 'Executive Member' },
  { value: 'coreMember', label: 'Core Member' },
  { value: 'member', label: 'Member' },
  { value: 'User', label: 'User' },
]

// Form field configurations
export const YEAR_OPTIONS = [
  { value: 'First', label: 'First' },
  { value: 'Second', label: 'Second' },
  { value: 'Third', label: 'Third' },
  { value: 'Fourth', label: 'Fourth' },
  { value: 'Other', label: 'Other' },
]

export const MEMBERSHIP_PLANS = [
  { value: '358', label: '1 Year (₹358)' },
  { value: '664', label: '2 Years (₹664)' },
  { value: '919', label: '3 Years (₹919)' },
]

export const PAYMENT_STATUS_OPTIONS = [
  { value: 'pending', label: 'pending' },
  { value: 'completed', label: 'completed' },
  { value: 'failed', label: 'failed' },
]
