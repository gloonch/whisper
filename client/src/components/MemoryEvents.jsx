import React from "react";
import { motion } from "framer-motion";

const EVENT_TYPES = {
  MEETING: "First Meeting",
  TRIP: "Trip",
  PARTY: "Party", 
  BIRTHDAY: "Birthday",
  ANNIVERSARY: "Anniversary",
  DATE: "Date",
  FIGHT_MAKEUP: "Fight & Makeup",
};

function MemoryEvents({ events = [] }) {
  // اگر هیچ event ای نیست، هیچی نمایش نده
  if (events.length === 0) {
    return null;
  }

  // Events list برای Memory
  return (
    <div className="px-4 py-4">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
        🎉 Events of This Day
      </h3>
      
      <div className="space-y-3">
        {events.map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center space-x-4 p-4 bg-white/10 rounded-2xl"
          >
            {/* Icon based on event type */}
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0">
              <span className="text-2xl">
                {event.type === 'MEETING' && '💕'}
                {event.type === 'TRIP' && '✈️'}
                {event.type === 'PARTY' && '🎉'}
                {event.type === 'BIRTHDAY' && '🎂'}
                {event.type === 'ANNIVERSARY' && '💐'}
                {event.type === 'DATE' && '💖'}
                {event.type === 'FIGHT_MAKEUP' && '🕊️'}
                {!['MEETING', 'TRIP', 'PARTY', 'BIRTHDAY', 'ANNIVERSARY', 'DATE', 'FIGHT_MAKEUP'].includes(event.type) && '📅'}
              </span>
            </div>

            {/* Event info */}
            <div className="flex-1 min-w-0">
              <h4 className="text-white font-medium">
                {event.title}
              </h4>
              <p className="text-white/60 text-sm">
                {new Date(event.date).getFullYear()}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default MemoryEvents; 