import React, { useState } from "react";
import { motion } from "framer-motion";
import { RECURRENCE_OPTIONS, WHISPER_CATEGORIES } from "./WhisperTypes";

function WhisperCard({ 
  whisper, 
  onConvertToEvent, 
  onDelete,
  index = 0 
}) {
  const [showActions, setShowActions] = useState(false);



  const getRecurrenceInfo = () => {
    return Object.values(RECURRENCE_OPTIONS).find(rec => rec.id === whisper.recurrence) || RECURRENCE_OPTIONS.ONCE;
  };

  const getCategoryColor = () => {
    const type = whisper.type;
    if (type.includes('together') || type.includes('cook') || type.includes('sunset') || type.includes('story') || type.includes('game') || type.includes('walk') || type.includes('movie')) {
      return WHISPER_CATEGORIES.shared.color;
    } else {
      return WHISPER_CATEGORIES.custom.color;
    }
  };

  const handleConvertToEvent = () => {
    onConvertToEvent?.(whisper);
  };

  const handleDelete = () => {
    onDelete?.(whisper.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`p-4 rounded-2xl border-2 transition-all duration-300 bg-white/10 border-white/20 hover:border-white/40`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="flex items-start justify-between">
        {/* Main Content */}
        <div className="flex items-start space-x-3 flex-1">
          {/* Emoji */}
          <div 
            className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl border-2 border-white/20"
            style={{ backgroundColor: `${getCategoryColor()}20` }}
          >
            {whisper.emoji}
          </div>

          {/* Text and Info */}
          <div className="flex-1 min-w-0">
            <h4 className={`font-medium mb-1 ${
              whisper.isDone ? 'text-white/60 line-through' : 'text-white'
            }`}>
              {whisper.text}
            </h4>
            
            <div className="flex items-center space-x-2 text-xs">
              <span 
                className="px-2 py-1 rounded-full font-medium"
                style={{ 
                  backgroundColor: getCategoryColor(),
                  color: 'white'
                }}
              >
                {getRecurrenceInfo().label}
              </span>
              <span className="text-white/60">•</span>
              <span className="text-white/60 text-xs">
                Together 👫
              </span>

            </div>
          </div>
        </div>

        {/* Actions */}
        <div className={`flex items-center space-x-2 transition-opacity duration-200 ${
          showActions ? 'opacity-100' : 'opacity-0'
        }`}>
          {
            <motion.button
              onClick={handleConvertToEvent}
              className="p-2 rounded-lg bg-lime-200 hover:bg-lime-600 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="Add to timeline"
            >
              <svg className="w-4 h-4 text-lime-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </motion.button>
          }

          {/* Delete button */}
          <motion.button
            onClick={handleDelete}
            className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Delete whisper"
          >
            <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </motion.button>
        </div>
      </div>

      {/* No done state or progress UI */}
    </motion.div>
  );
}

export default WhisperCard;