import { Search } from 'lucide-react'

const SearchBar = ({ value, onChange, placeholder = "Search executive members..." }) => (
  <div className="relative">
    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="pl-10 pr-4 py-2 border border-[#ccc] rounded bg-white focus:outline-none focus:border-[#79aec8] w-64"
    />
  </div>
)

export default SearchBar
