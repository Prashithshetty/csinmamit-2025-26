const RemoveRoleModal = ({ member, onConfirm, onCancel }) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded p-6 max-w-md w-full">
      <h2 className="text-lg font-semibold text-[#333] mb-4">Remove Executive Member Role</h2>
      <p className="text-gray-600 mb-6">
        Are you sure you want to remove the executive member role from "{member?.name || member?.email}"? 
        They will become a regular user.
      </p>
      <div className="flex items-center justify-end space-x-3">
        <button
          onClick={onCancel}
          className="px-4 py-2 border border-[#ccc] rounded hover:bg-[#f5f5f5]"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="px-4 py-2 bg-[#ba2121] text-white rounded hover:bg-[#8a1919]"
        >
          Yes, Remove Role
        </button>
      </div>
    </div>
  </div>
)

export default RemoveRoleModal
