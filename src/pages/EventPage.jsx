import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { mockEvents } from '../data/eventsData';
import NotFound from './NotFound';
import { Calendar, Clock, MapPin, Users, ArrowLeft } from 'lucide-react';
import { getEventTypeColor, formatEventDate } from '../utils/eventUtils';
import { useAuth } from '../contexts/AuthContext.jsx';
import toast from 'react-hot-toast';

const findEventById = (id) => {
  for (const year in mockEvents) {
    const found = mockEvents[year].find(event => event.id.toString() === id);
    if (found) return found;
  }
  return null;
};

const EventPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const event = findEventById(id);

  if (!event) {
    return <NotFound />;
  }

  const imageUrl = `${window.location.origin}${event.image}`;

  return (
    // This new div adds padding to the top of the page, pushing all content
    // down to appear below your transparent navbar.
    <div className="pt-20">
      <HelmetProvider>
        <Helmet>
          {/* Meta tags */}
          <title>{event.title} - CSI-NMAMIT</title>
          <meta name="description" content={event.description} />
          <meta property="og:type" content="website" />
          <meta property="og:url" content={window.location.href} />
          <meta property="og:title" content={event.title} />
          <meta property="og:description" content={event.description} />
          <meta property="og:image" content={imageUrl} />
          <meta property="twitter:card" content="summary_large_image" />
          <meta property="twitter:url" content={window.location.href} />
          <meta property="twitter:title" content={event.title} />
          <meta property="twitter:description" content={event.description} />
          <meta property="twitter:image" content={imageUrl} />
        </Helmet>
      </HelmetProvider>

      {/* Changed py-10 (padding top/bottom) to pb-10 (padding bottom only) to avoid double padding */}
      <div className="container mx-auto px-4 pb-10">
        
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden max-w-5xl mx-auto">
          <div className="relative h-64 md:h-80 overflow-hidden">
            
            <Link 
              to="/events" 
              className="absolute top-4 left-4 z-10 inline-flex items-center gap-2 bg-black/50 text-white px-3 py-1.5 rounded-lg hover:bg-black/75 transition-colors text-sm"
            >
              <ArrowLeft size={16} />
              Back to Events
            </Link>
            
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div
              className={`absolute top-4 right-4 px-3 py-1 rounded-full text-white text-xs font-medium bg-gradient-to-r ${getEventTypeColor(
                event.type
              )}`}
            >
              {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
            </div>
          </div>

          <div className="p-6 md:p-8">
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-2">{event.title}</h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">{event.description}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 text-gray-700 dark:text-gray-300">
              <div className="flex items-center gap-3"><Calendar className="text-primary-500" size={20} /><span>{formatEventDate(event.date)}</span></div>
              <div className="flex items-center gap-3"><Clock className="text-primary-500" size={20} /><span>{event.time}</span></div>
              <div className="flex items-center gap-3"><MapPin className="text-primary-500" size={20} /><span>{event.location}</span></div>
              <div className="flex items-center gap-3"><Users className="text-primary-500" size={20} /><span>{event.participants} Participants</span></div>
            </div>

            <div className="mt-8">
              <button
                className="w-full md:w-auto btn-primary text-base px-8 py-3"
                onClick={() => {
                  if (user) {
                    navigate(`/events/${event.id}/register`);
                  } else {
                    toast.error("Please sign in to register for events.");
                  }
                }}
              >
                {event.status === "upcoming" ? "Register Now" : "View Details"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventPage;