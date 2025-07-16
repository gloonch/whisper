import React, { useState } from "react";
import { motion } from "framer-motion";
import { TARGET_OPTIONS, RECURRENCE_OPTIONS, WHISPER_CATEGORIES } from "./WhisperTypes";

function WhisperCard({ 
  whisper, 
  onMarkDone, 
  onConvertToEvent, 
  onDelete,
  index = 0 
}) {
  const [showActions, setShowActions] = useState(false);

  const getTargetInfo = () => {
    return Object.values(TARGET_OPTIONS).find(target => target.id === whisper.for) || TARGET_OPTIONS.SELF;
  };

  const getRecurrenceInfo = () => {
    return Object.values(RECURRENCE_OPTIONS).find(rec => rec.id === whisper.recurrence) || RECURRENCE_OPTIONS.ONCE;
  };

  const getCategoryColor = () => {
    const type = whisper.type;
    if (type.includes('water') || type.includes('break') || type.includes('exercise')) {
      return WHISPER_CATEGORIES.self_care.color;
    } else if (type.includes('partner') || type.includes('kind') || type.includes('love') || type.includes('listen')) {
      return WHISPER_CATEGORIES.partner_care.color;
    } else if (type.includes('together') || type.includes('cook') || type.includes('sunset') || type.includes('story')) {
      return WHISPER_CATEGORIES.shared.color;
    } else {
      return WHISPER_CATEGORIES.custom.color;
    }
  };

  const handleMarkDone = () => {
    onMarkDone?.(whisper.id);
  };

  const handleConvertToEvent = () => {
    if (whisper.canBecomeEvent && whisper.isDone) {
      onConvertToEvent?.(whisper);
    }
  };

  const handleDelete = () => {
    onDelete?.(whisper.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`p-4 rounded-2xl border-2 transition-all duration-300 ${
        whisper.isDone 
          ? 'bg-white/5 border-green-400/30 opacity-75' 
          : 'bg-white/10 border-white/20 hover:border-white/40'
      }`}
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
              <span className="text-white/60">
                {getTargetInfo().label}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className={`flex items-center space-x-2 transition-opacity duration-200 ${
          showActions || whisper.isDone ? 'opacity-100' : 'opacity-0'
        }`}>
          {!whisper.isDone ? (
            <motion.button
              onClick={handleMarkDone}
              className="p-2 rounded-lg bg-green-500/20 hover:bg-green-500/30 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="Mark as done"
            >
              <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </motion.button>
          ) : (
            <div className="flex items-center space-x-1">
              {/* Done indicator */}
              <div className="p-2 rounded-lg bg-green-500/20">
                <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                </svg>
              </div>

              {/* Convert to Event button */}
              {whisper.canBecomeEvent && (
                <motion.button
                  onClick={handleConvertToEvent}
                  className="p-2 rounded-lg bg-ruby-accent/20 hover:bg-ruby-accent/30 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  title="Add to timeline"
                >
                  <svg className="w-4 h-4 text-ruby-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </motion.button>
              )}
            </div>
          )}

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

      {/* Progress indicator for everyday whispers */}
      {whisper.recurrence === 'everyday' && (
        <div className="mt-3 pt-3 border-t border-white/10">
          <div className="flex items-center justify-between text-xs text-white/60">
            <span>Daily reminder</span>
            <span>{whisper.isDone ? 'Done today ✓' : 'Pending'}</span>
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default WhisperCard;