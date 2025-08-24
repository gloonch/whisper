import React from "react";
import { motion } from "framer-motion";
import WhisperCard from "./WhisperCard";

function WhispersList({ 
  whispers = [], 
  selectedDate, 
  onConvertToEvent, 
  onDeleteWhisper,
  onAddWhisper 
}) {
  const getWhispersTitle = () => {
    return "💬 Whispers of Today";
  };

  // Filter whispers for the selected date
  const getWhispersForDate = () => {
    const dateString = selectedDate.toISOString().split('T')[0];
    
    return whispers.filter(whisper => {
      // Include whispers specifically for this date
      if (whisper.date === dateString) {
        return true;
      }
      
      // Include everyday whispers if they're active
      if (whisper.recurrence === 'everyday') {
        const whisperDate = new Date(whisper.date);
        return whisperDate <= selectedDate;
      }
      
      return false;
    });
  };

  const filteredWhispers = getWhispersForDate();

  return (
    <div className="px-4 py-6">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">
          {getWhispersTitle()}
        </h3>
      </div>

      {/* Whispers List */}
      {filteredWhispers.length > 0 ? (
        <div className="space-y-3 mb-6">
          {filteredWhispers.map((whisper, index) => (
            <WhisperCard
              key={whisper.id}
              whisper={whisper}
              index={index}
              onConvertToEvent={onConvertToEvent}
              onDelete={onDeleteWhisper}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-8 mb-6">
          <div className="text-4xl mb-3">🌟</div>
          <h4 className="text-white/80 font-medium mb-2">
            No whispers for this day
          </h4>
          <p className="text-white/60 text-sm">
            Add gentle reminders to nurture your relationship
          </p>
        </div>
      )}

      {/* Add Whisper Button */}
      <motion.button
        onClick={onAddWhisper}
        className="w-full py-4 border-2 border-dashed border-white/30 rounded-2xl text-white/70 hover:text-white hover:border-white/50 hover:bg-white/5 transition-all duration-200 flex items-center justify-center space-x-2"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        <span className="font-medium">Add Whisper</span>
      </motion.button>

    </div>
  );
}

export default WhispersList; 