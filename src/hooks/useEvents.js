// Load events based on selected year
useEffect(() => {
  const loadEvents = async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch from Firestore
      const eventsRef = collection(db, "events");
      const q = query(
        eventsRef,
        where("year", "==", parseInt(selectedYear)),
        where("published", "==", true),
        orderBy("date", "desc")
      );

      let eventsData = [];
      try {
        const snapshot = await getDocs(q);
        eventsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
      } catch (firestoreError) {
        // If Firestore query fails (e.g., index not created), try without orderBy
        const simpleQuery = query(
          eventsRef,
          where("year", "==", parseInt(selectedYear)),
          where("published", "==", true)
        );

        const snapshot = await getDocs(simpleQuery);
        eventsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Sort manually if orderBy failed
        eventsData.sort((a, b) => {
          const dateA = new Date(a.date || a.createdAt?.toDate());
          const dateB = new Date(b.date || b.createdAt?.toDate());
          return dateB - dateA;
        });
      }

      // If no events in Firestore, fallback to mock data
      if (eventsData.length === 0 && mockEvents[selectedYear]) {
        const yearEvents = mockEvents[selectedYear] || [];
        setEvents(yearEvents);
      } else {
        setEvents(eventsData);
      }
    } catch (err) {
      setError("Failed to load events");
      // Fallback to mock data on error
      const yearEvents = mockEvents[selectedYear] || [];
      setEvents(yearEvents);
    } finally {
      setLoading(false);
    }
  };

  loadEvents();
}, [selectedYear]);

// Filter events when search term or type changes
useEffect(() => {
  // Initial events state is now set inside the first useEffect
  // so we apply filtering based on that state
  const filtered = filterEvents(events, searchTerm, selectedType);
  setFilteredEvents(filtered);
}, [searchTerm, selectedType, events]);
