import React from "react";
import { motion } from "framer-motion";

const EVENT_COLORS = {
  MEETING: "#FFDF6E",
  TRIP: "#4DA8FF", 
  PARTY: "#FF66A8",
  BIRTHDAY: "#B588FF",
  ANNIVERSARY: "#FF9A3C",
  DATE: "#7CE38B",
  FIGHT_MAKEUP: "#9D9D9D",
};

const EVENT_TYPES = {
  MEETING: "First Meeting",
  TRIP: "Trip",
  PARTY: "Party", 
  BIRTHDAY: "Birthday",
  ANNIVERSARY: "Anniversary",
  DATE: "Date",
  FIGHT_MAKEUP: "Fight & Makeup",
};

function EventsList({ events = [], selectedDate, onAddEvent }) {
  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long', 
      day: 'numeric'
    });
  };

  // Empty state
  if (events.length === 0) {
    return (
      <div className="px-4 py-8">
        <div className="text-center">
          <div className="text-4xl mb-4">📅</div>
          <h3 className="text-lg font-medium text-white/80 mb-2">
            No events on {formatDate(selectedDate)}
          </h3>
          <p className="text-sm text-white/60 mb-6">
            Add a special memory for this day
          </p>
          <button
            onClick={onAddEvent}
            className="px-6 py-3 bg-ruby-accent text-white rounded-full hover:bg-ruby-accent/90 transition-colors font-medium"
          >
            ✨ Add Event
          </button>
        </div>
      </div>
    );
  }

  // Events list
  return (
    <div className="px-4 py-4">
      <h3 className="text-lg font-semibold text-white mb-4">
        {formatDate(selectedDate)}
      </h3>
      
      <div className="space-y-3">
        {events.map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center space-x-4 p-4 bg-white/10 rounded-2xl hover:bg-white/15 transition-colors cursor-pointer"
          >
            {/* Thumbnail */}
            <div 
              className="w-12 h-12 rounded-xl border-2 border-white/20 flex items-center justify-center overflow-hidden flex-shrink-0"
              style={{ backgroundColor: EVENT_COLORS[event.type] || EVENT_COLORS.DATE }}
            >
              {event.imageUrl ? (
                <img
                  src={event.imageUrl}
                  alt={event.title}
                  className="w-full h-full object-cover rounded-xl"
                />
              ) : (
                <span className="text-lg">
                  {event.type === 'MEETING' && '💕'}
                  {event.type === 'TRIP' && '✈️'}
                  {event.type === 'PARTY' && '🎉'}
                  {event.type === 'BIRTHDAY' && '🎂'}
                  {event.type === 'ANNIVERSARY' && '💐'}
                  {event.type === 'DATE' && '💖'}
                  {event.type === 'FIGHT_MAKEUP' && '🕊️'}
                </span>
              )}
            </div>

            {/* Event info */}
            <div className="flex-1 min-w-0">
              <h4 className="text-white font-medium truncate">
                {event.title}
              </h4>
              <p className="text-white/60 text-sm">
                {EVENT_TYPES[event.type] || event.type}
              </p>
            </div>

            {/* Arrow indicator */}
            <div className="text-white/40">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Add more button */}
      <button
        onClick={onAddEvent}
        className="w-full mt-4 py-3 border-2 border-dashed border-white/30 rounded-2xl text-white/60 hover:text-white hover:border-white/50 transition-colors"
      >
        ➕ Add Another Event
      </button>
    </div>
  );
}

export default EventsList; 