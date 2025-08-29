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

  // Load events based on selected year
  // Load events based on selected year
  useEffect(() => {
    const loadEvents = async () => {
      setLoading(true);
      setError(null);

      // --- START: DEVELOPMENT MODE LOGIC ---
      // Check if the app is in development mode
      if (import.meta.env.DEV) {
        console.log("DEV MODE: Loading mock events.");
        // Directly use mock data for the selected year
        const yearEvents = mockEvents[selectedYear] || [];
        setEvents(yearEvents);
        setFilteredEvents(yearEvents);
        setLoading(false);
        return; // Stop execution here for dev mode
      }
      // --- END: DEVELOPMENT MODE LOGIC ---

      // --- PRODUCTION MODE LOGIC (Original Code) ---
      try {
        // Fetch from Firestore
        const eventsRef = collection(db, "events");
        const q = query(
          eventsRef,
          where("year", "==", parseInt(selectedYear)),
          where("published", "==", true),
          orderBy("date", "desc")
        );

        const snapshot = await getDocs(q);
        const eventsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        if (eventsData.length > 0) {
          setEvents(eventsData);
          setFilteredEvents(eventsData);
        } else {
          // Fallback if firestore is empty
          console.log("No events in Firestore, using mock data as fallback");
          const yearEvents = mockEvents[selectedYear] || [];
          setEvents(yearEvents);
          setFilteredEvents(yearEvents);
        }
      } catch (err) {
        console.error("Error loading events:", err);
        setError("Failed to load events");

        // Fallback to mock data on any error
        const yearEvents = mockEvents[selectedYear] || [];
        setEvents(yearEvents);
        setFilteredEvents(yearEvents);
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, [selectedYear]);

  // Filter events when search term or type changes
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
