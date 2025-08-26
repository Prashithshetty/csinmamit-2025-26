import { motion } from 'framer-motion'
import { 
  User, 
  Mail, 
  Phone, 
  Building,
  BookOpen,
  GraduationCap,
  Edit,
  Save,
  X,
  Loader
} from 'lucide-react'

const ProfileForm = ({
  profileData,
  isEditing,
  loading,
  onEdit,
  onSave,
  onCancel,
  onInputChange
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="lg:col-span-2"
    >
      <div className="glass-card rounded-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold">Profile Information</h3>
          {!isEditing ? (
            <button
              onClick={onEdit}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-500 text-white hover:bg-primary-600 transition-colors"
            >
              <Edit size={18} />
              Edit Profile
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={onSave}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-colors disabled:opacity-50"
              >
                {loading ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : (
                  <Save size={18} />
                )}
                Save
              </button>
              <button
                onClick={onCancel}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-500 text-white hover:bg-gray-600 transition-colors disabled:opacity-50"
              >
                <X size={18} />
                Cancel
              </button>
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Name */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <User size={16} />
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={profileData.name}
              onChange={onInputChange}
              disabled={!isEditing}
              className="input-field"
            />
          </div>

          {/* Email */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Mail size={16} />
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={profileData.email}
              disabled
              className="input-field opacity-60"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Phone size={16} />
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={profileData.phone}
              onChange={onInputChange}
              disabled={!isEditing}
              placeholder="+91 XXXXX XXXXX"
              className="input-field"
            />
          </div>

          {/* College */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Building size={16} />
              College
            </label>
            <input
              type="text"
              name="college"
              value={profileData.college}
              disabled
              className="input-field opacity-60"
            />
          </div>

          {/* Branch */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <BookOpen size={16} />
              Branch
            </label>
            <select
              name="branch"
              value={profileData.branch}
              onChange={onInputChange}
              disabled={!isEditing}
              className="input-field"
            >
              <option value="">Select Branch</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Information Science">Information Science</option>
              <option value="Electronics">Electronics</option>
              <option value="Mechanical">Mechanical</option>
              <option value="Civil">Civil</option>
              <option value="Electrical">Electrical</option>
            </select>
          </div>

          {/* Year */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <GraduationCap size={16} />
              Year
            </label>
            <select
              name="year"
              value={profileData.year}
              onChange={onInputChange}
              disabled={!isEditing}
              className="input-field"
            >
              <option value="">Select Year</option>
              <option value="First Year">First Year</option>
              <option value="Second Year">Second Year</option>
              <option value="Third Year">Third Year</option>
              <option value="Final Year">Final Year</option>
            </select>
          </div>

          {/* Bio */}
          <div className="md:col-span-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <User size={16} />
              Bio
            </label>
            <textarea
              name="bio"
              value={profileData.bio}
              onChange={onInputChange}
              disabled={!isEditing}
              rows={4}
              placeholder="Tell us about yourself..."
              className="input-field resize-none"
            />
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default ProfileForm
