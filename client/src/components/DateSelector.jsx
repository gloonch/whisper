import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";

function DateSelector({ events = [], onDateSelect, selectedDate }) {
  // Generate 5 days: 2 before today, today, 2 after today
  const dates = useMemo(() => {
    const today = new Date();
    const dateArray = [];
    
    for (let i = -2; i <= 2; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dateArray.push(date);
    }
    
    return dateArray;
  }, []);

  // Get events for a specific date
  const getEventsForDate = (date) => {
    const dateString = date.toISOString().split('T')[0];
    return events.filter(event => 
      event.date && event.date.startsWith(dateString)
    );
  };

  // Check if date is today
  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  // Check if date is selected
  const isSelected = (date) => {
    if (!selectedDate) return isToday(date);
    return date.toDateString() === selectedDate.toDateString();
  };

  // Format date for display
  const formatDate = (date) => {
    const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    const dayName = dayNames[date.getDay()];
    const dayNumber = date.getDate();
    
    return { dayName, dayNumber };
  };

  const handleDateClick = (date) => {
    const eventsForDate = getEventsForDate(date);
    onDateSelect?.(date, eventsForDate);
  };

  return (
    <div className="w-full px-4 py-4">
      <div className="flex justify-between items-center">
        {dates.map((date, index) => {
          const { dayName, dayNumber } = formatDate(date);
          const hasEvents = getEventsForDate(date).length > 0;
          const todayFlag = isToday(date);
          const selected = isSelected(date);

          return (
            <motion.button
              key={date.toISOString()}
              onClick={() => handleDateClick(date)}
              className="relative flex flex-col items-center justify-center p-3 transition-all bg-transparent hover:bg-white/5"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Day name */}
              <span className={`text-xs font-medium mb-1 ${
                todayFlag ? 'text-white font-bold' : 'text-white/70'
              }`}>
                {todayFlag ? 'TODAY' : dayName}
              </span>
              
              {/* Day number with circle */}
              <div className="relative">
                <span className={`text-lg font-bold relative z-10 w-8 h-8 flex items-center justify-center ${
                  selected 
                    ? 'text-bg-deep' 
                    : todayFlag 
                      ? 'text-white' 
                      : 'text-white/70'
                }`}>
                  {dayNumber}
                </span>
                
                {/* Selection circle (only around number) */}
                {selected && (
                  <div className="absolute inset-0 bg-white rounded-full shadow-lg" />
                )}
                
                {/* Today indicator circle (when not selected) */}
                {todayFlag && !selected && (
                  <div className="absolute inset-0 border-2 border-white/40 rounded-full" />
                )}
              </div>

              {/* Event indicator dot */}
              {hasEvents && (
                <motion.div
                  className="absolute -bottom-1 w-2 h-2 bg-ruby-accent rounded-full"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

export default DateSelector;