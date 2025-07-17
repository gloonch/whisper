import React, { useState } from 'react';
import { motion } from 'framer-motion';

const ExploreBar = ({ 
  publicEvents = [], 
  todoCount = 0, 
  onShowExploreGrid, 
  onShowTodoList 
}) => {
  const [isDragging, setIsDragging] = useState(false);

  const displayEvents = publicEvents;

  const handleTodoClick = () => {
    onShowTodoList?.();
  };

  const handleMoreClick = () => {
    onShowExploreGrid?.();
  };

  const handleEventClick = (event) => {
    // در آینده: باز کردن جزئیات آیتم
    console.log('Event clicked:', event);
  };

  return (
    <div className="w-full py-4 px-4 bg-white/5 border-b border-white/10">


      {/* Story Bar */}
      <motion.div 
        className="flex space-x-3 overflow-x-auto scrollbar-hide pb-2"
        drag="x"
        dragConstraints={{ left: -200, right: 0 }}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={() => setIsDragging(false)}
      >
        {/* Todo List دکمه */}
        <motion.button
          onClick={handleTodoClick}
          className="flex-shrink-0 relative"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{ 
            perspective: '100px',
            transformStyle: 'preserve-3d'
          }}
        >
          <div className="w-16 h-16 rounded-full border-4 border-white/20 flex items-center justify-center relative">
            
            {/* Badge برای تعداد todo ها */}
            {todoCount > 0 && (
              <div className="absolute w-5 h-5 bg-ruby-accent rounded-full flex items-center justify-center">
                <span className="text-white text-md font-bold">{todoCount}</span>
              </div>
            )}
          </div>
          <p className="text-white/70 text-xs mt-1 text-center">To-Do</p>
        </motion.button>


        {/* More دکمه */}
        <motion.button
          onClick={handleMoreClick}
          className="flex-shrink-0 relative"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{ 
            perspective: '100px',
            transformStyle: 'preserve-3d'
          }}
        >
                     <div className="w-16 h-16 rounded-full bg-white/5 border-4 border-white/20 border-dashed flex items-center justify-center">
            <span className="text-white/60 text-2xl">➕</span>
          </div>
          <p className="text-white/70 text-xs mt-1 text-center">More</p>
        </motion.button>


        {/* Public Events */}
        {displayEvents.map((event, index) => (
          <motion.button
            key={event.id}
            onClick={() => !isDragging && handleEventClick(event)}
            className="flex-shrink-0 relative"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{ 
              perspective: '100px',
              transformStyle: 'preserve-3d'
            }}
          >
                         <div className="w-16 h-16 rounded-full bg-white/10 border-4 border-white/20 overflow-hidden relative">
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
              {/* Fallback icon */}
              <div 
                className="w-full h-full flex items-center justify-center text-2xl"
                style={{ display: event.imageUrl ? 'none' : 'flex' }}
              >
                🌟
              </div>
            </div>
            <p className="text-white/70 text-xs mt-1 text-center truncate w-16">
              {event.title}
            </p>
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
};

export default ExploreBar; 