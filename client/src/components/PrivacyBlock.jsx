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