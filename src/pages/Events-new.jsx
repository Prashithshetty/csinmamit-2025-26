import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import EventsHero from "../components/Events/EventsHero";
import EventsFilter from "../components/Events/EventsFilter";
import EventsGrid from "../components/Events/EventsGrid";
import EventsEmpty from "../components/Events/EventsEmpty";
import EventDetailModal from "../components/Events/EventDetailModal"; // 👈 Import the new modal
import { useEvents } from "../hooks/useEvents";

const Events = () => {
  const [selectedEvent, setSelectedEvent] = useState(null); // 👈 This state will manage the modal

  const {
    filteredEvents,
    loading,
    selectedYear,
    setSelectedYear,
    selectedType,
    setSelectedType,
    searchTerm,
    setSearchTerm,
  } = useEvents("2025"); // Default year can be changed here

  return (
    <div className="min-h-screen pt-20">
      <EventsHero />

      <EventsFilter
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        selectedType={selectedType}
        setSelectedType={setSelectedType}
      />

      <section className="section-padding">
        <div className="container-custom">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="skeleton h-96 rounded-xl" />
              ))}
            </div>
          ) : filteredEvents.length > 0 ? (
            <EventsGrid
              events={filteredEvents}
              onViewDetails={setSelectedEvent} // 👈 Pass the function to open the modal
            />
          ) : (
            <EventsEmpty />
          )}
        </div>
      </section>

      {/* This will render the modal ONLY when an event is selected */}
      <AnimatePresence>
        {selectedEvent && (
          <EventDetailModal
            event={selectedEvent}
            onClose={() => setSelectedEvent(null)} // 👈 Pass the function to close the modal
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Events;
