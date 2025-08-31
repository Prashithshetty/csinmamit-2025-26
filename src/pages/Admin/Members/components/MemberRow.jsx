import { Eye, Trash2 } from 'lucide-react'
import { formatDate, getRowClassName } from '../utils/helpers'

const MemberRow = ({ 
  member, 
  index, 
  isSelected, 
  isEditing, 
  onSelect, 
  onEdit, 
  onUpdate, 
  onRemoveRole, 
  onViewDetails 
}) => (
  <tr className={getRowClassName(index, isSelected)}>
    <td className="px-4 py-2">
      <input
        type="checkbox"
        checked={isSelected}
        onChange={() => onSelect(member.id)}
        className="rounded border-gray-300"
      />
    </td>
    <td className="px-4 py-2">
      {isEditing ? (
        <input
          type="text"
          defaultValue={member.name}
          onBlur={(e) => onUpdate(member.id, { name: e.target.value })}
          className="px-2 py-1 border border-[#ccc] rounded"
          autoFocus
        />
      ) : (
        <button
          onClick={() => onEdit(member.id)}
          className="text-[#417690] hover:text-[#205067] font-medium text-left"
        >
          {member.name || 'Unnamed Member'}
        </button>
      )}
    </td>
    <td className="px-4 py-2 text-gray-600">
      <a href={`mailto:${member.email}`} className="hover:text-[#417690]">
        {member.email}
      </a>
    </td>
    <td className="px-4 py-2 text-gray-600">{member.usn || '-'}</td>
    <td className="px-4 py-2 text-gray-600">{member.branch || '-'}</td>
    <td className="px-4 py-2 text-gray-600">{member.year || '-'}</td>
    <td className="px-4 py-2 text-gray-600">
      {member.phone ? (
        <a href={`tel:${member.phone}`} className="hover:text-[#417690]">
          {member.phone}
        </a>
      ) : '-'}
    </td>
    <td className="px-4 py-2">
      <span className="inline-block px-2 py-1 text-xs rounded bg-green-100 text-green-800">
        {member.position || 'Executive Member'}
      </span>
    </td>
    <td className="px-4 py-2 text-gray-600">{formatDate(member.createdAt)}</td>
    <td className="px-4 py-2">
      <div className="flex items-center space-x-2">
        <button
          onClick={() => onViewDetails(member)}
          className="text-[#417690] hover:text-[#205067]"
          title="View Details"
        >
          <Eye className="w-4 h-4" />
        </button>
        <button
          onClick={() => onRemoveRole(member)}
          className="text-[#ba2121] hover:text-[#8a1919]"
          title="Remove Executive Role"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </td>
  </tr>
)

export default MemberRow
