import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGlobalToast } from "../context/ToastContext";

export default function ManagePublicMomentsModal({ 
  isOpen, 
  onClose, 
  publicEvents = [],
  onEventPrivacyChange
}) {
  // Global Toast hook
  const { showSuccess } = useGlobalToast();

  const showToastMessage = (message) => {
    showSuccess("Privacy", message);
  };

  const handleMakePrivate = (event) => {
    onEventPrivacyChange?.(event.id, true);
    showToastMessage(`"${event.title}" is now private`);
  };

  if (!isOpen) return null;

  return (
    <>
      <AnimatePresence>
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-bg-deep border border-white/10 rounded-2xl w-full max-w-md max-h-[80vh] overflow-hidden"
          >
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-white/10">
              <h2 className="text-lg font-semibold text-cream">Public Moments</h2>
              <button
                onClick={onClose}
                className="text-white/60 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="overflow-y-auto max-h-[60vh]">
              {publicEvents.length === 0 ? (
                <div className="p-6 text-center">
                  <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-cream mb-2">No Public Moments</h3>
                  <p className="text-mist-blue text-sm">
                    You haven't made any events public yet.
                  </p>
                </div>
              ) : (
                <div className="p-4 space-y-3">
                  {publicEvents.map((event) => (
                    <div 
                      key={event.id}
                      className="bg-white/5 rounded-xl p-4 flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-3 flex-1 min-w-0">
                        {/* Event Image/Icon */}
                        <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          {event.imageUrl ? (
                            <img
                              src={event.imageUrl}
                              alt={event.title}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <svg className="w-5 h-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                          )}
                        </div>

                        {/* Event Info */}
                        <div className="flex-1 min-w-0">
                          <h4 className="text-cream font-medium truncate">
                            {event.title}
                          </h4>
                          <p className="text-sm text-mist-blue">
                            {new Date(event.date).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'short', 
                              day: 'numeric' 
                            })}
                          </p>
                        </div>
                      </div>

                      {/* Make Private Button */}
                      <button
                        onClick={() => handleMakePrivate(event)}
                        className="bg-red-500/20 hover:bg-red-500/30 text-red-400 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex-shrink-0"
                      >
                        Make Private
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-white/10">
              <button
                onClick={onClose}
                className="w-full bg-white/10 hover:bg-white/20 text-cream py-3 rounded-xl transition-colors font-medium"
              >
                Done
              </button>
            </div>
          </motion.div>
        </div>
      </AnimatePresence>


    </>
  );
} 