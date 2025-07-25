import React, { useState } from "react";
import ManagePublicMomentsModal from "./ManagePublicMomentsModal";

export default function PrivacyBlock({ 
  autoPublic = false,
  onAutoPublicChange,
  publicEvents = [],
  onEventPrivacyChange,
  onSignOut,
  onClearData
}) {
  const [showManageModal, setShowManageModal] = useState(false);

  const handleToggleAutoPublic = () => {
    onAutoPublicChange?.(!autoPublic);
  };

  const handleEventPrivacyChange = (eventId, makePrivate) => {
    onEventPrivacyChange?.(eventId, makePrivate);
  };

  return (
    <>
      <div className="space-y-6">
        {/* Privacy Settings */}
        <div className="bg-white/5 rounded-xl p-4 shadow-md shadow-white/5">
          <h3 className="text-lg font-semibold text-cream mb-4">Privacy & Sharing</h3>
          
          {/* Auto-public Toggle */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex-1 pr-4">
              <p className="text-cream font-medium mb-1">
                Auto-make events public?
              </p>
              <p className="text-sm text-mist-blue">
                When long-pressed, events become visible to others.
              </p>
            </div>
            
            <button
              onClick={handleToggleAutoPublic}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                autoPublic 
                  ? "bg-ruby-accent" 
                  : "bg-white/20"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  autoPublic ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {/* Manage Public Moments Button */}
          <button
            onClick={() => setShowManageModal(true)}
            className="w-full bg-white/10 hover:bg-white/20 text-cream py-3 px-4 rounded-xl transition-colors font-medium"
          >
            Manage Public Moments
            <span className="ml-2 text-sm text-mist-blue">
              ({publicEvents.length})
            </span>
          </button>
        </div>

        {/* Danger Zone */}
        <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4">
          <h3 className="text-lg font-semibold text-red-400 mb-4">Danger Zone</h3>
          
          <div className="space-y-3">
            <button
              onClick={onSignOut}
              className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-400 py-3 px-4 rounded-xl transition-colors font-medium"
            >
              Sign Out
            </button>
            
            <button
              onClick={onClearData}
              className="w-full bg-red-600/10 hover:bg-red-600/20 text-red-500 py-3 px-4 rounded-xl transition-colors font-medium"
            >
              Clear Local Data
            </button>
          </div>
          
          <p className="text-xs text-red-400/70 mt-3">
            These actions cannot be undone. Please be careful.
          </p>
        </div>
      </div>

      {/* Manage Public Moments Modal */}
      <ManagePublicMomentsModal
        isOpen={showManageModal}
        onClose={() => setShowManageModal(false)}
        publicEvents={publicEvents}
        onEventPrivacyChange={handleEventPrivacyChange}
      />
    </>
  );
} 