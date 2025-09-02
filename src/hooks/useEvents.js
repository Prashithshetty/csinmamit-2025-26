import { useState, useEffect } from "react";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { db } from "../config/firebase";
import { mockEvents } from "../data/eventsData";
import { filterEvents } from "../utils/eventUtils";

/**
 * Custom hook for managing events data and filtering
 */
export const useEvents = (initialYear = "2024") => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedYear, setSelectedYear] = useState(initialYear);
  const [selectedType, setSelectedType] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Effect to load events from Firestore or fall back to mock data
  useEffect(() => {
    const loadEvents = async () => {
      setLoading(true);
      setError(null);
      let eventsData = [];

      try {
        const eventsRef = collection(db, "events");

        try {
          // First, try the optimized query with ordering
          const orderedQuery = query(
            eventsRef,
            where("year", "==", parseInt(selectedYear)),
            where("published", "==", true),
            orderBy("date", "desc")
          );
          const snapshot = await getDocs(orderedQuery);
          eventsData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
        } catch (firestoreError) {
          // If the ordered query fails (e.g., missing index), fallback to a simple query
          console.warn(
            "Firestore query with ordering failed. Falling back to a simpler query."
          );
          const simpleQuery = query(
            eventsRef,
            where("year", "==", parseInt(selectedYear)),
            where("published", "==", true)
          );
          const snapshot = await getDocs(simpleQuery);
          const unsortedData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          // Manually sort the data since the query couldn't
          unsortedData.sort((a, b) => new Date(b.date) - new Date(a.date));
          eventsData = unsortedData;
        }

        // If Firestore returns no events, use the mock data as a fallback
        if (eventsData.length === 0) {
          console.log(
            "No events found in Firestore for this year. Using mock data."
          );
          eventsData = mockEvents[selectedYear] || [];
        }
      } catch (err) {
        // If any other error occurs, log it and use mock data
        console.error("An error occurred while fetching events:", err);
        setError("Failed to load events. Displaying mock data.");
        eventsData = mockEvents[selectedYear] || [];
      } finally {
        setEvents(eventsData);
        setFilteredEvents(eventsData); // Initially, filtered events are all events
        setLoading(false);
      }
    };

    loadEvents();
  }, [selectedYear]);

  // Effect to filter events whenever the filters or the base event list change
  useEffect(() => {
    const filtered = filterEvents(events, searchTerm, selectedType);
    setFilteredEvents(filtered);
  }, [searchTerm, selectedType, events]);

  return {
    events,
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
