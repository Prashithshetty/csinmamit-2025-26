import { useState } from "react";
import EventsHero from "../components/Events/EventsHero";
import EventsFilter from "../components/Events/EventsFilter";
import EventsGrid from "../components/Events/EventsGrid";
import EventsEmpty from "../components/Events/EventsEmpty";
import { useEvents } from "../hooks/useEvents";
import EventDetailModal from "../components/Events/EventDetailModal"; // Import the modal

const Events = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null); // State for the selected event

  const {
    filteredEvents,
    loading,
    selectedYear,
    setSelectedYear,
    selectedType,
    setSelectedType,
    searchTerm,
    setSearchTerm,
  } = useEvents("2025");

  // Function to open the modal
  const handleOpenModal = (event) => {
    setSelectedEvent(event);
  };

  // Function to close the modal
  const handleCloseModal = () => {
    setSelectedEvent(null);
  };

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <EventsHero />

      {/* Filters Section */}
      <EventsFilter
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        selectedType={selectedType}
        setSelectedType={setSelectedType}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
      />

      {/* Events Grid */}
      <section className="section-padding">
        <div className="container-custom">
          {filteredEvents.length > 0 ? (
            <EventsGrid
              events={filteredEvents}
              loading={loading}
              onOpenModal={handleOpenModal}
            />
          ) : (
            !loading && <EventsEmpty />
          )}
        </div>
      </section>

      {/* Event Detail Modal */}
      {selectedEvent && (
        <EventDetailModal event={selectedEvent} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default Events;
