import React, { useState } from "react";
import ProfileNavbar from "../components/ProfileNavbar";
import DateSelector from "../components/DateSelector";
import EventsList from "../components/EventsList";
import EventModal from "../components/EventModal";

// Sample events data - in real app this would come from RelationshipTimeline
const getTodayBasedEvents = () => {
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];
  
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  return [
    {
      id: "1",
      date: todayStr,
      type: "MEETING",
      title: "First Meeting",
      imageUrl: "https://placehold.co/64x64/FFDF6E/18181c?text=👋",
    },
    {
      id: "2",
      date: tomorrowStr,
      type: "DATE",
      title: "Coffee Date",
      imageUrl: "",
    },
    {
      id: "3",
      date: yesterdayStr,
      type: "ANNIVERSARY",
      title: "6 Month Anniversary",
      imageUrl: "",
    },
  ];
};

function Whispers() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [events, setEvents] = useState(getTodayBasedEvents());

  const handleDateSelect = (date, eventsForDate) => {
    setSelectedDate(date);
    setSelectedEvents(eventsForDate);
  };

  const handleAddEvent = () => {
    setModalOpen(true);
  };

  const handleSaveEvent = (eventData) => {
    // Set date to selected date if adding new event
    const newEvent = {
      ...eventData,
      date: selectedDate.toISOString().split('T')[0]
    };
    
    const newEvents = [...events, newEvent];
    setEvents(newEvents);
    
    // Update selected events if they match the current date
    if (selectedDate.toISOString().split('T')[0] === newEvent.date) {
      setSelectedEvents([...selectedEvents, newEvent]);
    }
  };

  const handleDeleteEvent = (eventId) => {
    const newEvents = events.filter(e => e.id !== eventId);
    setEvents(newEvents);
    setSelectedEvents(selectedEvents.filter(e => e.id !== eventId));
  };

  // Initialize with today's events
  React.useEffect(() => {
    const today = new Date();
    const todayString = today.toISOString().split('T')[0];
    const todayEvents = events.filter(event => 
      event.date && event.date.startsWith(todayString)
    );
    setSelectedDate(today);
    setSelectedEvents(todayEvents);
  }, [events]);

  return (
    <div className="flex flex-col h-full bg-bg-deep">
      {/* Profile Navbar */}

      {/* Page Title
      <div className="px-4 py-4">
        <h1 className="text-2xl font-bold text-white mb-2">Whispers</h1>
        <p className="text-white/60 text-sm">Your shared moments and memories</p>
      </div> */}

      <ProfileNavbar 
        name="Mahdi"
        username="@gloonch"
        onProfileClick={() => console.log('Profile clicked')}
      />

      {/* Date Selector */}
      <DateSelector 
        events={events}
        onDateSelect={handleDateSelect}
        selectedDate={selectedDate}
      />

      {/* Events List */}
      <div className="flex-1 overflow-y-auto">
        <EventsList 
          events={selectedEvents}
          selectedDate={selectedDate}
          onAddEvent={handleAddEvent}
        />
      </div>

      {/* Event Modal */}
      <EventModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveEvent}
        onDelete={handleDeleteEvent}
        event={null}
        mode="add"
        prefilledDate={selectedDate}
        hideDate={true}
      />
    </div>
  );
}

export default Whispers;