import React, { useState } from "react";
import EditProfileModal from "./EditProfileModal";

export default function ProfileHeader({ 
  user = { name: "Mahdi", username: "gloonch", avatar: null },
  onUserUpdate 
}) {
  const [showEditModal, setShowEditModal] = useState(false);

  const handleUserUpdate = (updatedUser) => {
    onUserUpdate?.(updatedUser);
    setShowEditModal(false);
  };

  return (
    <>
      <div className="flex flex-col items-center py-6 px-4">
        {/* Avatar Circle */}
        <div className="relative mb-4">
          <div className="w-20 h-20 rounded-full bg-white/10 border border-white/20 overflow-hidden flex items-center justify-center">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-3xl text-white/60">
                {user.name.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          
          {/* Edit Button */}
          <button
            onClick={() => setShowEditModal(true)}
            className="absolute -bottom-1 -right-1 w-7 h-7 bg-ruby-accent rounded-full flex items-center justify-center border-2 border-bg-deep hover:bg-ruby-accent/80 transition-colors"
          >
            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
        </div>

        {/* User Info */}
        <div className="text-center">
          <h1 className="text-xl font-semibold text-cream mb-1">
            {user.name}
          </h1>
          <p className="text-sm text-mist-blue">
            @{user.username}
          </p>
        </div>
      </div>

      {/* Edit Modal */}
      <EditProfileModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSave={handleUserUpdate}
        currentUser={user}
      />
    </>
  );
} 