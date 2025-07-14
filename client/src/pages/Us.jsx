import React, { useState } from "react";
import RelationshipTimeline from "../components/RelationshipTimeline";

const initialEvents = [
  {
    id: "1",
    date: "2021-01-01",
    type: "MEETING",
    title: "First Meeting",
    imageUrl: "",
  },
  {
    id: "2",
    date: "2021-03-14",
    type: "TRIP",
    title: "Spring Trip",
    imageUrl: "",
  },
  {
    id: "3",
    date: "2021-06-21",
    type: "BIRTHDAY",
    title: "Birthday Surprise",
    imageUrl: "",
  },
  {
    id: "4",
    date: "2022-02-14",
    type: "ANNIVERSARY",
    title: "1st Anniversary",
    imageUrl: "",
  },
  {
    id: "5",
    date: "2022-07-10",
    type: "FIGHT_MAKEUP",
    title: "Big Fight & Makeup",
    imageUrl: "",
  },
];

function Us() {
  const [events, setEvents] = useState(initialEvents);

  const handleEventsChange = (newEvents) => {
    setEvents(newEvents);
    // در آینده: ذخیره در Firebase
    console.log("Events updated:", newEvents);
  };

  return (
    <div className="flex flex-col h-full bg-bg-deep">
      <div className="px-4 py-6 border-b border-white/10">
        <h1 className="text-2xl font-semibold text-white mb-2">Our Story</h1>
        <p className="text-white/70 text-sm">Timeline of our beautiful journey together</p>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        <RelationshipTimeline 
          events={events} 
          onEventsChange={handleEventsChange}
        />
      </div>
    </div>
  );
}

export default Us; 