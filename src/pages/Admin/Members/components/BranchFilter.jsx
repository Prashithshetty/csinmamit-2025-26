const BranchFilter = ({ branches, value, onChange }) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="px-3 py-2 border border-[#ccc] rounded bg-white focus:outline-none focus:border-[#79aec8]"
  >
    <option value="all">All Branches</option>
    {branches.map(branch => (
      <option key={branch} value={branch}>{branch}</option>
    ))}
  </select>
)

export default BranchFilter
