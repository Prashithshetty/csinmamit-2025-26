import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { motion } from "framer-motion";

const EventRegistration = () => {
  const { user, signInWithGoogle } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Get the specific event data passed from the modal link
  const event = location.state?.event;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    usn: "",
    branch: "",
    year: "",
  });

  // Pre-fill form if user is logged in
  useEffect(() => {
    if (user) {
      setFormData((prevData) => ({
        ...prevData,
        name: user.name || "",
        email: user.email || "",
      }));
    }
  }, [user]);

  // Handle cases where a user lands on this page directly without event data
  useEffect(() => {
    if (!event) {
      // Redirect back to the main events page if no event is selected
      navigate("/events");
    }
  }, [event, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Registering for event:", event.title);
    console.log("Form Submitted:", formData);
    alert("Thank you for registering! (Check console for data)");
  };

  if (!event) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold mb-4">Please Log In</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            You need to be logged in to register for an event.
          </p>
          <button onClick={signInWithGoogle} className="btn-primary px-8 py-3">
            Log In with Google
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto"
      >
        <h1 className="text-4xl font-bold text-center mb-2 gradient-text-animated">
          Event Registration
        </h1>
        {/* This title is now dynamic */}
        <p className="text-center text-xl text-gray-600 dark:text-gray-400 mb-8">
          For: {event.title}
        </p>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 bg-white dark:bg-gray-800/50 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
        >
          {/* Form fields remain the same... */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full input-field"
              required
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              className="mt-1 block w-full input-field bg-gray-100 dark:bg-gray-700"
              readOnly
            />
          </div>

          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="mt-1 block w-full input-field"
              required
            />
          </div>

          <div>
            <label
              htmlFor="usn"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              USN / College ID
            </label>
            <input
              type="text"
              id="usn"
              name="usn"
              value={formData.usn}
              onChange={handleChange}
              className="mt-1 block w-full input-field"
              required
            />
          </div>

          <div>
            <label
              htmlFor="branch"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Branch / Department
            </label>
            <select
              id="branch"
              name="branch"
              value={formData.branch}
              onChange={handleChange}
              className="mt-1 block w-full input-field"
              required
            >
              <option value="" disabled>
                Select your branch
              </option>
              <option value="Computer Science">
                Computer Science & Engineering
              </option>
              <option value="Information Science">
                Information Science & Engineering
              </option>
              <option value="AI & ML">
                Artificial Intelligence & Machine Learning
              </option>
              <option value="Electronics & Communication">
                Electronics & Communication
              </option>
              <option value="Mechanical">Mechanical Engineering</option>
              <option value="Civil">Civil Engineering</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="year"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Year of Study
            </label>
            <select
              id="year"
              name="year"
              value={formData.year}
              onChange={handleChange}
              className="mt-1 block w-full input-field"
              required
            >
              <option value="" disabled>
                Select your year
              </option>
              <option value="1">1st Year</option>
              <option value="2">2nd Year</option>
              <option value="3">3rd Year</option>
              <option value="4">4th Year</option>
            </select>
          </div>

          <div>
            <button type="submit" className="w-full btn-primary py-3 px-4">
              Submit Registration
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default EventRegistration;
