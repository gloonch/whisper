import React, { useState } from "react";
import RelationshipTimeline from "./RelationshipTimeline";

// Sample data for testing
const SAMPLE_EVENTS = [
  {
    id: "1",
    title: "First Meeting",
    date: "2023-01-15",
    type: "MEETING",
    imageUrl: ""
  },
  {
    id: "2", 
    title: "Our First Date",
    date: "2023-02-14",
    type: "DATE",
    imageUrl: ""
  },
  {
    id: "3",
    title: "Weekend Trip to Paris",
    date: "2023-06-10",
    type: "TRIP",
    imageUrl: ""
  },
  {
    id: "4",
    title: "Sarah's Birthday",
    date: "2023-09-22",
    type: "BIRTHDAY", 
    imageUrl: ""
  },
  {
    id: "5",
    title: "Our 1 Year Anniversary",
    date: "2024-01-15",
    type: "ANNIVERSARY",
    imageUrl: ""
  }
];

export default function TimelineExample() {
  const [events, setEvents] = useState(SAMPLE_EVENTS);

  const handleEventsChange = (newEvents) => {
    setEvents(newEvents);
    console.log("Events updated:", newEvents);
  };

  return (
    <div className="min-h-screen bg-bg-deep p-4">
      <div className="max-w-lg mx-auto">
        <h1 className="text-2xl font-bold text-white text-center mb-8">
          Our Love Story
        </h1>
        <RelationshipTimeline 
          events={events}
          onEventsChange={handleEventsChange}
        />
      </div>
    </div>
  );
} 