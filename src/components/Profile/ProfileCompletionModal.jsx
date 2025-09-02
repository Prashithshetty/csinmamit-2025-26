import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom"; // Added useLocation
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Phone,
  BookOpen,
  GraduationCap,
  CreditCard,
  AlertCircle,
  Loader,
  CheckCircle,
} from "lucide-react";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../config/firebase";
import { useAuth } from "../../contexts/AuthContext";
import toast from "react-hot-toast";

const ProfileCompletionModal = ({ isOpen, onComplete, onClose }) => {
  const { user, checkProfileCompletion } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    branch: "",
    year: "",
    usn: "",
  });
  const [errors, setErrors] = useState({});
  const location = useLocation(); // Correctly call the hook

  if (location.pathname.startsWith("/admin")) {
    return null;
  }

  // (The rest of the logic remains the same...)
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || user.displayName || "",
        phone: user.phone || user.profile?.phone || "",
        branch: user.branch || user.profile?.branch || "",
        year: user.year || user.profile?.year || "",
        usn: user.usn || "",
      });
    }
  }, [user]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[6-9]\d{9}$/.test(formData.phone.replace(/\D/g, ""))) {
      newErrors.phone = "Please enter a valid 10-digit phone number";
    }
    if (!formData.branch) newErrors.branch = "Branch is required";
    if (!formData.year) newErrors.year = "Year is required";
    if (!formData.usn.trim()) {
      newErrors.usn = "USN is required";
    } else if (!/^4NM\d{2}[A-Z]{2}\d{3}$/i.test(formData.usn.toUpperCase())) {
      newErrors.usn = "Please enter a valid USN (e.g., 4NM21CS001)";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fill in all required fields correctly");
      return;
    }
    if (!user?.uid) {
      toast.error("User not authenticated");
      return;
    }
    setLoading(true);
    try {
      const userRef = doc(db, "users", user.uid);
      const updateData = {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        branch: formData.branch,
        year: formData.year,
        usn: formData.usn.toUpperCase().trim(),
        profileCompleted: true,
        profile: {
          phone: formData.phone.trim(),
          college: "NMAMIT",
          branch: formData.branch,
          year: formData.year,
          bio: user.profile?.bio || "",
        },
        updatedAt: serverTimestamp(),
      };
      await setDoc(userRef, updateData, { merge: true });
      await checkProfileCompletion();
      toast.success("Profile completed successfully! Welcome to CSI NMAMIT!");
      if (onComplete) onComplete();
    } catch (error) {
      // console.error('Error completing profile:', error)
      toast.error("Failed to complete profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          onClick={onClose} // Allow closing by clicking the background
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3 }}
          className="relative w-full max-w-2xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-t-2xl flex-shrink-0">
            <div className="flex items-center gap-3 text-white">
              <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
                <AlertCircle size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Complete Your Profile</h2>
                <p className="text-blue-100 mt-1">
                  Please fill in your details to continue
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="p-6 space-y-4 overflow-y-auto flex-1"
          >
            {/* Form fields... */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <CheckCircle
                  className="text-blue-600 dark:text-blue-400 mt-0.5"
                  size={20}
                />
                <div className="flex-1">
                  <p className="text-sm text-blue-800 dark:text-blue-200 font-medium">
                    Welcome to CSI NMAMIT!
                  </p>
                  <p className="text-sm text-blue-600 dark:text-blue-300 mt-1">
                    Complete your profile to access all features and join our
                    community.
                  </p>
                </div>
              </div>
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <User size={16} />
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.name
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 dark:border-gray-700 focus:ring-blue-500"
                } bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 transition-all`}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">{errors.name}</p>
              )}
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Phone size={16} />
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Enter your 10-digit phone number"
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.phone
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 dark:border-gray-700 focus:ring-blue-500"
                } bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 transition-all`}
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
              )}
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <BookOpen size={16} />
                Branch <span className="text-red-500">*</span>
              </label>
              <select
                name="branch"
                value={formData.branch}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.branch
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 dark:border-gray-700 focus:ring-blue-500"
                } bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 transition-all`}
              >
                <option value="">Select your branch</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Information Science">Information Science</option>
                <option value="Electronics & Communication">
                  Electronics & Communication
                </option>
                <option value="Mechanical">Mechanical</option>
                <option value="Civil">Civil</option>
                <option value="Electrical & Electronics">
                  Electrical & Electronics
                </option>
                <option value="Artificial Intelligence & Machine Learning">
                  AI & ML
                </option>
                <option value="Artificial Intelligence & Data Science">
                  AI & DS
                </option>
              </select>
              {errors.branch && (
                <p className="mt-1 text-sm text-red-500">{errors.branch}</p>
              )}
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <GraduationCap size={16} />
                Year <span className="text-red-500">*</span>
              </label>
              <select
                name="year"
                value={formData.year}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.year
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 dark:border-gray-700 focus:ring-blue-500"
                } bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 transition-all`}
              >
                <option value="">Select your year</option>
                <option value="First Year">First Year</option>
                <option value="Second Year">Second Year</option>
                <option value="Third Year">Third Year</option>
                <option value="Final Year">Final Year</option>
              </select>
              {errors.year && (
                <p className="mt-1 text-sm text-red-500">{errors.year}</p>
              )}
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <CreditCard size={16} />
                USN <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="usn"
                value={formData.usn}
                onChange={handleInputChange}
                placeholder="e.g., 4NM21CS001"
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.usn
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 dark:border-gray-700 focus:ring-blue-500"
                } bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 transition-all uppercase`}
              />
              {errors.usn && (
                <p className="mt-1 text-sm text-red-500">{errors.usn}</p>
              )}
            </div>

            {/* Buttons Section */}
            <div className="!mt-8 pt-4 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-end items-center gap-4">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
              >
                Skip for now
              </button>
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto py-2 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader className="animate-spin" size={20} />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle size={20} />
                    <span>Complete Profile</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ProfileCompletionModal;
