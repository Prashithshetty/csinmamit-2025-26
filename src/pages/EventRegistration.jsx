import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getEventById } from "../services/eventService";
import toast from "react-hot-toast";

const EventRegistration = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    usn: ''
  });

  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true);
      try {
        const eventData = await getEventById(id);
        setEvent(eventData);
      } catch (error) {
        console.error("Failed to fetch event:", error);
        toast.error("Could not load event details.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchEvent();
    }
  }, [id]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Here you would submit the registration to your backend
      console.log("Submitting registration:", formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success(`Successfully registered for ${event.title}!`);
      // Optionally redirect back to events page
      // navigate('/events');
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Registration failed. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 pt-28 pb-12 text-center">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="mt-4">Loading registration form...</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="container mx-auto px-4 pt-28 pb-12 text-center">
        <h2 className="text-2xl font-bold">Event Not Found</h2>
        <p className="mt-4">The event you are looking for does not exist.</p>
        <Link to="/events" className="mt-6 inline-block btn-primary">
          Back to Events
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 pt-28 pb-12">
      <div className="max-w-2xl mx-auto">
        {/* Registration Form */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">
            Register for {event.title}
          </h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleFormChange}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Enter your full name"
                required
              />
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleFormChange}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Enter your email address"
                required
              />
            </div>

            {/* Phone Field */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleFormChange}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Enter your phone number"
                required
              />
            </div>

            {/* USN Field */}
            <div>
              <label htmlFor="usn" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                USN
              </label>
              <input
                type="text"
                id="usn"
                name="usn"
                value={formData.usn}
                onChange={handleFormChange}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Enter your USN"
                required
              />
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                className="w-full btn-primary py-3 text-lg font-medium"
              >
                Submit Registration
              </button>
            </div>
          </form>

          {/* Back to Events Link */}
          <div className="text-center mt-6">
            <Link 
              to="/events" 
              className="text-primary-600 dark:text-primary-400 hover:underline"
            >
              ← Back to Events
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventRegistration;
