import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ExploreGrid = ({ 
  isVisible, 
  publicEvents = [], 
  onClose, 
  onEventClick 
}) => {
  const handleEventClick = (event) => {
    onEventClick?.(event);
  };

  const slideVariants = {
    hidden: { 
      y: '-100%',
      opacity: 0
    },
    visible: { 
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        damping: 25,
        stiffness: 300,
        duration: 0.5
      }
    },
    exit: { 
      y: '-100%',
      opacity: 0,
      transition: {
        duration: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.3
      }
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="absolute inset-0 z-50 bg-bg-deep"
          variants={slideVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <h2 className="text-xl font-semibold text-white">Explore Ideas</h2>
            <motion.button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </motion.button>
          </div>

          {/* Grid Content */}
          <div className="flex-1 overflow-y-auto p-4">
            <motion.div 
              className="grid grid-cols-3 gap-3"
              initial="hidden"
              animate="visible"
              variants={{
                visible: {
                  transition: {
                    staggerChildren: 0.1
                  }
                }
              }}
            >
              {publicEvents.map((event, index) => (
                <motion.button
                  key={event.id}
                  onClick={() => handleEventClick(event)}
                  className="aspect-square rounded-xl overflow-hidden relative group"
                  variants={itemVariants}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Background Image or Fallback */}
                  <div className="w-full h-full bg-white/10 flex items-center justify-center">
                    {event.imageUrl ? (
                      <img 
                        src={event.imageUrl} 
                        alt={event.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    {/* Fallback */}
                    <div 
                      className="w-full h-full flex items-center justify-center text-4xl"
                      style={{ display: event.imageUrl ? 'none' : 'flex' }}
                    >
                      🌟
                    </div>
                  </div>

                  {/* Overlay با عنوان */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent">
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <h3 className="text-white text-sm font-medium leading-tight">
                        {event.title}
                      </h3>
                    </div>
                  </div>

                  {/* Subtle border */}
                  <div className="absolute inset-0 border border-white/10 rounded-xl pointer-events-none" />
                </motion.button>
              ))}
            </motion.div>

            {/* Empty State */}
            {publicEvents.length === 0 && (
              <motion.div 
                className="flex flex-col items-center justify-center py-20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <div className="text-6xl mb-4">🌟</div>
                <h3 className="text-white/80 text-lg font-medium mb-2">No ideas yet</h3>
                <p className="text-white/60 text-sm">Explore events will appear here</p>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ExploreGrid; 