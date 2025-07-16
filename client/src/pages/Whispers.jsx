import React, { useState } from "react";
import ProfileNavbar from "../components/ProfileNavbar";
import DateSelector from "../components/DateSelector";
import MemoryEvents from "../components/MemoryEvents";
import WhispersList from "../components/WhispersList";
import WhisperModal from "../components/WhisperModal";
import { createWhisperData } from "../components/WhisperTypes";

// Sample events data - in real app this would come from RelationshipTimeline
const getTodayBasedEvents = () => {
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  
  // ایجاد eventهای نمونه برای سال‌های مختلف در همین روز
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();
  const currentDay = today.getDate();
  
  return [
    {
      id: "1",
      date: new Date(currentYear - 1, currentMonth, currentDay).toISOString().split('T')[0],
      type: "BIRTHDAY",
      title: "Birthday",
    },
    {
      id: "2", 
      date: new Date(currentYear - 2, currentMonth, currentDay).toISOString().split('T')[0],
      type: "TRIP",
      title: "Trip to North",
    },
    {
      id: "3",
      date: todayStr,
      type: "ANNIVERSARY", 
      title: "First Date Anniversary",
    },
  ];
};

function Whispers() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [whisperModalOpen, setWhisperModalOpen] = useState(false);
  const [events, setEvents] = useState(getTodayBasedEvents());
  const [whispers, setWhispers] = useState([
    // Sample whispers for testing
    createWhisperData({
      type: "drink_water",
      target: "self",
      recurrence: "everyday",
      date: new Date().toISOString().split('T')[0]
    }),
    createWhisperData({
      type: "hug_partner", 
      target: "partner",
      recurrence: "once",
      date: new Date().toISOString().split('T')[0]
    })
  ]);

  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  // Whisper handlers
  const handleAddWhisper = () => {
    setWhisperModalOpen(true);
  };

  const handleSaveWhisper = (whisperData) => {
    const newWhispers = [...whispers, whisperData];
    setWhispers(newWhispers);
    console.log("Whisper added:", whisperData);
  };

  const handleMarkWhisperDone = (whisperId) => {
    const newWhispers = whispers.map(whisper => 
      whisper.id === whisperId 
        ? { ...whisper, isDone: !whisper.isDone }
        : whisper
    );
    setWhispers(newWhispers);
  };

  const handleConvertWhisperToEvent = (whisper) => {
    if (!whisper.canBecomeEvent || !whisper.isDone) return;

    // Create event from whisper
    const eventData = {
      id: `event_from_whisper_${Date.now()}`,
      title: whisper.text,
      date: whisper.date,
      type: "DATE", // Default event type
    };

    const newEvents = [...events, eventData];
    setEvents(newEvents);

    console.log("Whisper converted to event:", eventData);
  };

  const handleDeleteWhisper = (whisperId) => {
    const newWhispers = whispers.filter(w => w.id !== whisperId);
    setWhispers(newWhispers);
  };

  // فیلتر کردن eventهای مربوط به روز انتخاب شده (در همه سال‌ها)
  const getEventsForSelectedDay = () => {
    const selectedMonth = selectedDate.getMonth();
    const selectedDay = selectedDate.getDate();
    
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.getMonth() === selectedMonth && 
             eventDate.getDate() === selectedDay;
    });
  };

  // Initialize with today's date
  React.useEffect(() => {
    const today = new Date();
    setSelectedDate(today);
  }, []);

  const memoryEvents = getEventsForSelectedDay();

  return (
    <div className="flex flex-col h-full bg-bg-deep">
      {/* Profile Navbar */}
      <ProfileNavbar 
        name="Mahdi"
        username="@gloonch"
        onProfileClick={() => console.log('Profile clicked')}
      />

      {/* Date Selector */}
      <DateSelector 
        events={events}
        whispers={whispers}
        onDateSelect={handleDateSelect}
        selectedDate={selectedDate}
      />

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto">
        {/* Whispers List - بالای صفحه */}
        <WhispersList
          whispers={whispers}
          selectedDate={selectedDate}
          onMarkDone={handleMarkWhisperDone}
          onConvertToEvent={handleConvertWhisperToEvent}
          onDeleteWhisper={handleDeleteWhisper}
          onAddWhisper={handleAddWhisper}
        />

        {/* Memory Events - پایین‌تر از whispers */}
        <MemoryEvents events={memoryEvents} />
      </div>

      {/* Whisper Modal */}
      <WhisperModal
        isOpen={whisperModalOpen}
        onClose={() => setWhisperModalOpen(false)}
        onSave={handleSaveWhisper}
        selectedDate={selectedDate}
      />
    </div>
  );
}

export default Whispers;