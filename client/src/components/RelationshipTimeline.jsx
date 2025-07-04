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
  NOW: "#FFFFFF",
};

export default function RelationshipTimeline({ events = [] }) {
  return (
    <div className="w-full flex justify-center py-6">
      <div className="relative flex flex-col items-start w-full max-w-md min-h-full">
        {/* Vertical line: left column */}
        <div className="absolute left-7 top-0 bottom-0 w-1 bg-bg-deep/40 opacity-60 z-0" style={{height: '100%'}} />
        <div className="flex flex-col-reverse gap-12 w-full z-10 justify-between min-h-[400px]">
          {events.map((event, idx) => (
            <TimelineNode
              key={event.id}
              event={event}
              color={EVENT_COLORS[event.type] || EVENT_COLORS.NOW}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function TimelineNode({ event, color }) {
  const [hovered, setHovered] = React.useState(false);
  return (
    <div className="flex flex-row items-center w-full group cursor-pointer relative select-none">
      {/* The line and the nodes */}
      <div className="flex flex-col items-center justify-center w-16 relative">
        <motion.div
          className="relative z-10"
          initial={false}
          animate={{ scale: hovered ? 1.12 : 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          {event.imageUrl ? (
            <span
              className="block w-14 h-14 rounded-full border-4 shadow-lg border-white flex items-center justify-center overflow-hidden"
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
              className="block w-14 h-14 rounded-full border-4 shadow-lg border-white flex items-center justify-center"
              style={{ background: color }}
            />
          )}
        </motion.div>
      </div>
      {/* Title and date column*/}
      <div className="flex flex-col min-w-0 ml-4 flex-1">
        <span className="text-sm font-medium truncate w-full text-bg-deep text-left">
          {event.title}
        </span>
        <motion.span
          className="text-xs text-bg-deep/70 mt-1 text-left w-full"
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : -4 }}
          transition={{ duration: 0.2 }}
          style={{ pointerEvents: "none" }}
        >
          {event.date}
        </motion.span>
      </div>
    </div>
  );
} 