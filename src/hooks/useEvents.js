import { useState, useEffect } from "react";
import { getEventsByYear } from "../services/eventService";
import { filterEvents } from "../utils/eventUtils";

export const useEvents = (initialYear = "2024") => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedYear, setSelectedYear] = useState(initialYear);
  const [selectedType, setSelectedType] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const loadEvents = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getEventsByYear(selectedYear);
        setEvents(data);
      } catch (err) {
        setError(null); // Do not show error to user, just fallback
        setEvents([]); // fallback already handled in service
      } finally {
        setLoading(false);
      }
    };
    loadEvents();
  }, [selectedYear]);

  useEffect(() => {
    const filtered = filterEvents(events, searchTerm, selectedType).sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );
    setFilteredEvents(filtered);
  }, [events, searchTerm, selectedType]);

  return {
    filteredEvents,
    loading,
    error,
    selectedYear,
    setSelectedYear,
    selectedType,
    setSelectedType,
    searchTerm,
    setSearchTerm,
  };
};
