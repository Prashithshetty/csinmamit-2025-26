import EventCard from "./EventCard";
import EventsEmpty from "./EventsEmpty";

const EventsGrid = ({ events, onRegister, onViewDetails }) => {
  if (!events || events.length === 0) {
    return <EventsEmpty />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
      {events.map((event) => (
        <EventCard
          key={event.id}
          event={event}
          onRegister={onRegister}
          onViewDetails={onViewDetails}
        />
      ))}
    </div>
  );
};

export default EventsGrid;
