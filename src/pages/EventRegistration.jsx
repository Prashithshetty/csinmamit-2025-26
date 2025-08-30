import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getEventById } from "../services/eventService";
import { Calendar, Clock, MapPin, Ticket } from "lucide-react";
import toast from "react-hot-toast";
import EventRegistrationForm from "./EventRegistration"; // We will rename the form component

const EventDetailPage = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true);
      try {
        const eventData = await getEventById(eventId);
        setEvent(eventData);
      } catch (error) {
        toast.error("Could not load event details.");
        console.error("Failed to fetch event:", error);
      } finally {
        setLoading(false);
      }
    };

    if (eventId) {
      fetchEvent();
    }
  }, [eventId]);

  const handleRegistrationSuccess = () => {
    // Hide the form and show a success message
    setShowRegistrationForm(false);
    toast.success(`You are now registered for ${event.title}!`);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <p>Loading event details...</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold">Event Not Found</h2>
        <p className="mt-4">The event you are looking for does not exist.</p>
        <Link to="/events" className="mt-6 inline-block btn-primary">
          Back to Events
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-20">
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
                {new Date(event.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
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

        {/* Conditional Rendering for Registration */}
        {!showRegistrationForm ? (
          <div className="text-center mt-12">
            <button
              onClick={() => setShowRegistrationForm(true)}
              className="btn-primary px-10 py-4 text-lg group"
            >
              <span className="flex items-center gap-2">
                <Ticket />
                Register for this Event
              </span>
            </button>
          </div>
        ) : (
          <EventRegistrationForm
            event={event}
            onSuccess={handleRegistrationSuccess}
            onCancel={() => setShowRegistrationForm(false)}
          />
        )}
      </div>
    </div>
  );
};

export default EventDetailPage;
