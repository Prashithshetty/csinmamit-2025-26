import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useProfile } from '../hooks/useProfile.js'; // Hook to get user profile data
import { db } from '../config/firebase.js'; // Firestore instance
import { doc, setDoc, updateDoc, increment, serverTimestamp } from 'firebase/firestore';
import toast from 'react-hot-toast';

const EventRegistrationForm = ({ event, onSuccess, onCancel }) => {
  const { user } = useAuth(); 
  const { profile, loading: profileLoading } = useProfile(); // Get user profile data and its loading state

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    usn: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);

  // Pre-fill form data once the user's profile is loaded
  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.fullName || user?.displayName || '',
        email: profile.email || user?.email || '',
        usn: profile.usn || '',
        phone: profile.phoneNumber || '',
      });
    }
  }, [profile, user]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    toast.loading('Submitting your registration...');

    // Basic validation
    if (!formData.name || !formData.email || !formData.usn || !formData.phone) {
      toast.dismiss();
      toast.error('Please fill out all fields.');
      setLoading(false);
      return;
    }

    try {
      // --- DATABASE LOGIC ---
      // Create a reference to a new registration document within the event
      // Using the user's ID as the document ID prevents duplicate registrations
      const registrationRef = doc(db, 'events', event.id, 'registrations', user.uid);
      
      // Data to be saved
      const registrationData = {
        userId: user.uid,
        ...formData,
        registeredAt: serverTimestamp(),
      };
      
      // Save the new registration document
      await setDoc(registrationRef, registrationData);

      // Also, update the main event document to increase the participant count
      const eventRef = doc(db, 'events', event.id);
      await updateDoc(eventRef, {
        participantCount: increment(1)
      });
      
      toast.dismiss();
      onSuccess(); // This calls the function in EventDetailPage.jsx to show success

    } catch (error) {
      toast.dismiss();
      toast.error('Registration failed. Please try again.');
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (profileLoading) {
    return (
        <div className="mt-12 p-8 text-center">
            <p>Loading your details...</p>
        </div>
    )
  }

  return (
    <div className="mt-12 p-8 bg-gray-100 dark:bg-gray-800 rounded-2xl shadow-inner">
      <h2 className="text-3xl font-bold text-center mb-6">Register for {event.title}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name Field */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            required
            disabled={loading}
          />
        </div>
        
        {/* Email Field */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            required
            disabled={loading}
          />
        </div>

        {/* USN Field */}
        <div>
          <label htmlFor="usn" className="block text-sm font-medium text-gray-700 dark:text-gray-300">USN</label>
          <input
            type="text"
            id="usn"
            name="usn"
            value={formData.usn}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            required
            disabled={loading}
          />
        </div>

        {/* Phone Field */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone Number</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            required
            disabled={loading}
          />
        </div>
        
        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-4 pt-4">
          <button 
            type="button" 
            onClick={onCancel}
            className="btn-secondary"
            disabled={loading}
          >
            Cancel
          </button>
          <button 
            type="submit"
            className="btn-primary"
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit Registration'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EventRegistrationForm;

