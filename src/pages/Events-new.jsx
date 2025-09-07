import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEvents } from "@/hooks/useEvents";
import { useAuth } from "@/contexts/AuthContext"; // Import useAuth
import EventsHero from "@/components/Events/EventsHero";
import EventsFilter from "@/components/Events/EventsFilter";
import EventsGrid from "@/components/Events/EventsGrid";
import EventDetailModal from "@/components/Events/EventDetailModal";
import { getEventById, registerUserForEvent } from "@/services/eventService"; // Import registerUserForEvent
import toast from "react-hot-toast"; // Import toast for notifications

const Events = () => {
  const navigate = useNavigate();
  const { user, isProfileIncomplete } = useAuth(); // Get user and profile status from context
  const {
    filteredEvents,
    loading,
    error,
    selectedYear,
    setSelectedYear,
    selectedType,
    setSelectedType,
    searchTerm,
    setSearchTerm,
  } = useEvents("2025");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();

  // --- UPDATED REGISTRATION LOGIC ---
  const handleRegister = async (event) => {
    // 1. Check if user is logged in
    if (!user) {
      toast.error("Please sign in to register for events.");
      navigate("/profile"); // Redirect to profile/login page
      return;
    }

    // 2. Check if the user's profile is complete
    if (isProfileIncomplete) {
      toast.error("Please complete your profile before registering.", {
        icon: "📝",
      });
      navigate("/profile"); // Redirect to profile page to complete it
      return;
    }

    // 3. Proceed with registration
    const toastId = toast.loading(`Registering for ${event.title}...`);
    const success = await registerUserForEvent(event, user);

    if (success) {
      toast.success(`Successfully registered for ${event.title}!`, {
        id: toastId,
        icon: "🎉",
      });
      handleCloseModal(); // Close the modal on success
    } else {
      toast.error("Registration failed. Please try again.", { id: toastId });
    }
  };

  const handleViewDetails = (event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
    setSearchParams({ eventId: event.id }, { replace: true });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
    const next = new URLSearchParams(searchParams);
    next.delete("eventId");
    setSearchParams(next, { replace: true });
  };

  // Open modal if deep-linked via ?eventId=...
  useEffect(() => {
    const eventId = searchParams.get("eventId");
    const openFromId = async () => {
      if (!eventId) return;
      // Try to find in current list first
      if (filteredEvents && filteredEvents.length > 0) {
        const match = filteredEvents.find(
          (e) => String(e.id) === String(eventId)
        );
        if (match) {
          setSelectedEvent(match);
          setIsModalOpen(true);
          return;
        }
      }
      // If not found, fetch by ID and adjust year
      try {
        const fetched = await getEventById(eventId);
        if (fetched?.year && String(fetched.year) !== String(selectedYear)) {
          setSelectedYear(String(fetched.year));
        }
        setSelectedEvent({ ...fetched, id: fetched.id });
        setIsModalOpen(true);
      } catch (_) {
        // ignore; leave page as-is
      }
    };
    openFromId();
  }, [searchParams, filteredEvents, selectedYear, setSelectedYear]);

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <EventsHero />
      <div className="container mx-auto px-4 py-12">
        <EventsFilter
          selectedYear={selectedYear}
          onYearChange={setSelectedYear}
          selectedType={selectedType}
          onTypeChange={setSelectedType}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />

        {loading && (
          <p className="text-center text-gray-500 mt-8">Loading events...</p>
        )}
        {error && <p className="text-center text-red-500 mt-8">{error}</p>}

        {!loading && !error && (
          <EventsGrid
            events={filteredEvents}
            onRegister={handleRegister}
            onViewDetails={handleViewDetails}
          />
        )}
      </div>

      {selectedEvent && (
        <EventDetailModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          event={selectedEvent}
          onRegister={handleRegister}
        />
      )}
    </div>
  );
};

export default Events;
