import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import EventModal from "./EventModal";

const EVENT_COLORS = {
  MEETING: "#FFDF6E",
  TRIP: "#4DA8FF",
  PARTY: "#FF66A8",
  BIRTHDAY: "#B588FF",
  ANNIVERSARY: "#FF9A3C",
  DATE: "#7CE38B",
  FIGHT_MAKEUP: "#9D9D9D",
  TODO_COMPLETED: "#22C55E",
  NOW: "#FFFFFF",
};

export default function RelationshipTimeline({ events = [], onEventsChange, onTogglePublic, showToast, onCreateEvent, onUpdateEvent, onDeleteEvent }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [modalMode, setModalMode] = useState("add"); // "add" or "edit" or "view"

  // Sort events by date (oldest first, newest last)
  const sortedEvents = [...events].sort((a, b) => new Date(a.date) - new Date(b.date));

  const handleAddEvent = () => {
    setSelectedEvent(null);
    setModalMode("add");
    setModalOpen(true);
  };

  const handleEditEvent = (event) => {
    setSelectedEvent(event);
    setModalMode("edit");
    setModalOpen(true);
  };

  const handleViewEvent = (event) => {
    setSelectedEvent(event);
    setModalMode("view");
    setModalOpen(true);
  };

  const handleModeChange = (newMode) => {
    setModalMode(newMode);
  };

  const handleSaveEvent = async (eventData) => {
    if (modalMode === "add") {
      if (onCreateEvent) {
        try {
          await onCreateEvent(eventData);
        } finally {
          setModalOpen(false);
        }
      } else {
        const newEvents = [...events, eventData];
        onEventsChange?.(newEvents);
        setModalOpen(false);
      }
    } else if (modalMode === "edit") {
      if (onUpdateEvent) {
        try {
          await onUpdateEvent(eventData);
        } finally {
          setModalOpen(false);
        }
      } else {
        const newEvents = events.map(e => e.id === eventData.id ? eventData : e);
        onEventsChange?.(newEvents);
        setModalOpen(false);
      }
    }
  };

  const handleDeleteEvent = (eventId) => {
    if (onDeleteEvent) {
      onDeleteEvent(eventId);
    } else {
      // Fallback to local state update
      const newEvents = events.filter(e => e.id !== eventId);
      onEventsChange?.(newEvents);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Empty state
  if (events.length === 0) {
    return (
      <>
        <div className="w-full flex justify-center py-12">
          <div className="text-center max-w-sm">
            <div className="text-6xl mb-4">🕊️</div>
            <h3 className="text-lg font-medium text-white/80 mb-2">
              No memories here yet…
            </h3>
            <p className="text-sm text-white/60 mb-6">
              Start your story with the first meeting.
            </p>
            <button
              onClick={handleAddEvent}
              className="px-6 py-3 bg-ruby-accent text-white rounded-full hover:bg-ruby-accent/90 transition-colors font-medium"
            >
              ✨ Add First Meeting
            </button>
          </div>
        </div>

        {/* Event Modal for empty state */}
        <EventModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSave={handleSaveEvent}
          onDelete={null}
          event={selectedEvent}
          mode={modalMode}
          onModeChange={handleModeChange}
          prefilledDate={null}
          hideDate={false}
        />
      </>
    );
  }

  return (
    <>
      <div className="w-full flex justify-center py-6">
        <div className="relative flex flex-col items-start w-full max-w-md min-h-full">
          {/* Vertical line - dynamic height based on content */}
          <div 
            className="absolute left-9 w-1 bg-white/20 opacity-60 z-0" 
            style={{
              top: '4rem', // Start after Add Event node
              height: `${Math.max(400, (sortedEvents.length + 1) * 104)}px` // Dynamic height
            }} 
          />
          
          <div className="flex flex-col gap-8 w-full z-10 justify-start min-h-[400px]">
            {/* Add Event Node (at the very top) */}
            <AddEventNode onClick={handleAddEvent} />
            
            {/* Timeline Events (sorted chronologically, newest first) */}
            <AnimatePresence mode="popLayout">
              {[...sortedEvents].reverse().map((event, idx) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: -50, scale: 0.8 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 50, scale: 0.8 }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 300, 
                    damping: 25,
                    delay: idx * 0.1 
                  }}
                  layout
                >
                  <TimelineNode
                    event={event}
                    color={EVENT_COLORS[event.type] || EVENT_COLORS.NOW}
                    onEdit={() => handleEditEvent(event)}
                    onView={() => handleViewEvent(event)}
                    formatDate={formatDate}
                    onTogglePublic={onTogglePublic}
                    showToast={showToast}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Event Modal */}
      <EventModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveEvent}
        onDelete={modalMode === "edit" ? handleDeleteEvent : null}
        event={selectedEvent}
        mode={modalMode}
        onModeChange={handleModeChange}
        prefilledDate={null}
        hideDate={false}
      />
    </>
  );
}

function AddEventNode({ onClick }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div className="flex flex-row items-center w-full group cursor-pointer relative select-none">
      {/* The add button node */}
      <div className="flex flex-col items-center justify-center w-20 relative">
        <motion.button
          className="relative z-10 w-16 h-16 rounded-full border-4 border-white/30 border-dashed bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
          initial={false}
          animate={{ scale: hovered ? 1.12 : 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onClick={onClick}
        >
          <span className="text-3xl text-white/70">➕</span>
        </motion.button>
      </div>
      
      {/* Label */}
      <div className="flex flex-col min-w-0 ml-4 flex-1">
        <span className="text-base font-medium text-white/60 text-left">
          Add Event
        </span>
        <motion.span
          className="text-sm text-white/40 mt-1 text-left w-full"
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : -4 }}
          transition={{ duration: 0.2 }}
          style={{ pointerEvents: "none" }}
        >
          Create a new memory
        </motion.span>
      </div>
    </div>
  );
}

function TimelineNode({ event, color, onEdit, onView, formatDate, onTogglePublic, showToast }) {
  const [hovered, setHovered] = useState(false);
  const [isLongPressing, setIsLongPressing] = useState(false);
  const longPressTimer = useRef(null);
  
  const handleClick = () => {
    if (onView) {
      onView(event);
    }
  };

  const handleMouseDown = () => {
    setIsLongPressing(false);
    longPressTimer.current = setTimeout(() => {
      setIsLongPressing(true);
      handleLongPress();
    }, 600);
  };

  const handleMouseUp = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
    setIsLongPressing(false);
  };

  const handleLongPress = () => {
    if (onTogglePublic) {
      onTogglePublic(event);
      const message = event.isPublic ? 'Event hidden from public' : 'Event shared publicly';
      showToast?.(message);
    }
  };

  useEffect(() => {
    return () => {
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
      }
    };
  }, []);

  return (
    <div 
      className="flex flex-row items-center w-full group cursor-pointer relative select-none"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        handleMouseUp();
        setHovered(false);
      }}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onClick={handleClick}
    >
      {/* The line and the nodes */}
      <div className="flex flex-col items-center justify-center w-20 relative">
        <motion.div
          className="relative z-10"
          initial={false}
          animate={{ 
            scale: hovered ? 1.12 : isLongPressing ? 1.2 : 1
          }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          {event.imageUrl ? (
            <span
              className={`block w-16 h-16 rounded-full border-4 shadow-lg border-white flex items-center justify-center overflow-hidden ${
                isLongPressing ? 'ring-4 ring-ruby-accent/50' : ''
              }`}
              style={{ background: color }}
            >
              <img
                src={event.imageUrl}
                alt="event"
                className="w-full h-full object-cover rounded-full"
              />
            </span>
          ) : (
            <span
              className={`block w-16 h-16 rounded-full border-4 shadow-lg border-white flex items-center justify-center ${
                isLongPressing ? 'ring-4 ring-ruby-accent/50' : ''
              }`}
              style={{ background: color }}
            >
              {/* Event type emoji */}
              <span className="text-2xl">
                {event.type === 'MEETING' && '💕'}
                {event.type === 'TRIP' && '✈️'}
                {event.type === 'PARTY' && '🎉'}
                {event.type === 'BIRTHDAY' && '🎂'}
                {event.type === 'ANNIVERSARY' && '💐'}
                {event.type === 'DATE' && '💖'}
                {event.type === 'FIGHT_MAKEUP' && '🕊️'}
                {event.type === 'TODO_COMPLETED' && '✅'}
              </span>
            </span>
          )}
        </motion.div>
      </div>
      
      {/* Title and date column */}
      <div className="flex flex-col min-w-0 ml-4 flex-1">
        <span className="text-base font-semibold truncate w-full text-white text-left">
          {event.title}
        </span>
        <span className="text-sm text-white/70 mt-1 text-left w-full">
          {formatDate(event.date)}
        </span>
        
        {/* Public indicator */}
        {event.isPublic && (
          <motion.span
            className="text-xs text-ruby-accent mt-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            Visible to public
          </motion.span>
        )}
      </div>
    </div>
  );
}
