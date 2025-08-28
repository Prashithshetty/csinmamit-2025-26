import { useState } from 'react'
import EventsHero from '../components/Events/EventsHero'
import EventsFilter from '../components/Events/EventsFilter'
import EventsGrid from '../components/Events/EventsGrid'
import EventsEmpty from '../components/Events/EventsEmpty'
import { useEvents } from '../hooks/useEvents'

const Events = () => {
  const [showFilters, setShowFilters] = useState(false)
  
  const {
    filteredEvents,
    loading,
    selectedYear,
    setSelectedYear,
    selectedType,
    setSelectedType,
    searchTerm,
    setSearchTerm
  } = useEvents('2025')

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
            <EventsGrid events={filteredEvents} loading={loading} />
          ) : (
            !loading && <EventsEmpty />
          )}
        </div>
      </section>
    </div>
  )
}

export default Events
