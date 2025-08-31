import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getEventById } from "../services/eventService.js";
import { Calendar, Clock, MapPin, Ticket } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../contexts/AuthContext.jsx";

const EventDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true);
      try {
        const eventData = await getEventById(id);
        setEvent(eventData);
      } catch (error) {
        toast.error("Could not load event details.");
        console.error("Failed to fetch event:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchEvent();
    }
  }, [id]);

  const handleRegister = () => {
    if (user) {
      // Redirect to the EventRegistration page
      navigate(`/events/${event.id}/register`);
    } else {
      toast.error("Please sign in to register for events.");
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-40 text-center">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="mt-4">Loading event details...</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="container mx-auto px-4 py-40 text-center">
        <h2 className="text-2xl font-bold">Event Not Found</h2>
        <p className="mt-4">The event you are looking for does not exist.</p>
        <Link to="/events" className="mt-6 inline-block btn-primary">
          Back to Events
        </Link>
      </div>
    );
  }
  
  // Helper to format Firestore Timestamps
  const formatDate = (timestamp) => {
    if (!timestamp) return 'Date not available';
    // The toDate() method converts a Timestamp to a JavaScript Date object
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
  };


  return (
    <div className="container mx-auto px-4 pt-28 pb-12">
      <div className="max-w-4xl mx-auto">
        {/* Event Header */}
        <div>
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-64 md:h-96 object-cover rounded-2xl shadow-lg"
          />
          <h1 className="text-4xl md:text-5xl font-bold mt-8">{event.title}</h1>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-gray-600 dark:text-gray-400 mt-4">
            <div className="flex items-center gap-2">
              <Calendar size={18} />
              <span>
                {formatDate(event.date)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={18} />
              <span>{event.time}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={18} />
              <span>{event.location}</span>
            </div>
          </div>
        </div>

        {/* Event Description */}
        <div className="prose dark:prose-invert max-w-none mt-12">
          <p>{event.description}</p>
        </div>

        {/* Registration Button */}
        <div className="text-center mt-12">
          <button
            onClick={handleRegister}
            className="btn-primary px-10 py-4 text-lg group"
          >
            <span className="flex items-center gap-2">
              <Ticket />
              Register for this Event
            </span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default EventDetailPage;

