import { useState, useEffect } from "react";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { db } from "../config/firebase";
import { mockEvents } from "../data/eventsData";
import { filterEvents } from "../utils/eventUtils";

export const useEvents = (initialYear = "2024") => {
  // State variables remain the same
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedYear, setSelectedYear] = useState(initialYear);
  const [selectedType, setSelectedType] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // This effect now ONLY handles fetching raw event data
  useEffect(() => {
    const loadEvents = async () => {
      setLoading(true);
      setError(null);
      let eventsData = [];

      try {
        // Attempt to fetch from Firestore
        const eventsRef = collection(db, "events");
        const q = query(
          eventsRef,
          where("year", "==", parseInt(selectedYear)),
          where("published", "==", true),
          orderBy("date", "desc")
        );
        const snapshot = await getDocs(q);
        eventsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // If Firestore returns no data, use mock data instead
        if (eventsData.length === 0) {
          console.warn(
            `No events found in Firestore for ${selectedYear}. Using mock data.`
          );
          setEvents(mockEvents[selectedYear] || []);
        } else {
          // If data is found, set it
          setEvents(eventsData);
        }
      } catch (err) {
        console.error("Firestore error, falling back to mock data:", err);
        setError("Failed to load events. Displaying local data.");
        // Fallback to mock data on any database error
        setEvents(mockEvents[selectedYear] || []);
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, [selectedYear]); // This effect re-runs ONLY when the year changes

  // This effect now handles ALL filtering and sorting
  useEffect(() => {
    const filtered = filterEvents(events, searchTerm, selectedType);
    const sorted = filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    setFilteredEvents(sorted);
  }, [events, searchTerm, selectedType]); // Re-runs when data or filters change

  // The return statement is correct and provides everything needed
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
