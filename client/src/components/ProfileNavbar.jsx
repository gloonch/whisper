import React from "react";
import { motion } from "framer-motion";

function ProfileNavbar({ 
  profileImage = null, 
  name = "Mahdi", 
  username = "@gloonch",
  onProfileClick
}) {
  return (
    <motion.div
      className="flex items-center justify-between px-4 py-4 border-b border-white/10"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Profile section */}
      <div className="flex items-center space-x-3">
        {/* Profile picture */}
        <motion.div
          className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-white/20 cursor-pointer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onProfileClick}
        >
          {profileImage ? (
            <img
              src={profileImage}
              alt={name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-ruby-accent flex items-center justify-center">
              <span className="text-white text-lg font-bold">
                {name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          
        </motion.div>

        {/* Name and username */}
        <div className="flex flex-col">
          <h2 className="text-white font-semibold text-base">
            {name}
          </h2>
          <p className="text-white/60 text-sm">
            {username}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-2">
        {/* Notifications */}
        <motion.button
          className="p-2 rounded-full hover:bg-white/10 transition-colors text-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          🔔
        </motion.button>

        {/* Settings */}
        <motion.button
          className="p-2 rounded-full hover:bg-white/10 transition-colors text-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          ⚙️
        </motion.button>
      </div>
    </motion.div>
  );
}

export default ProfileNavbar; 