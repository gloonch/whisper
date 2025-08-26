import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function EditProfileModal({ isOpen, onClose, onSave, currentUser }) {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    avatar: null
  });
  const [uploadedImage, setUploadedImage] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen && currentUser) {
      setFormData({
        name: currentUser.name || "",
        username: currentUser.username || "",
        avatar: currentUser.avatar || null
      });
      setUploadedImage(currentUser.avatar ? { dataUrl: currentUser.avatar } : null);
      setErrors({});
    }
  }, [isOpen, currentUser]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, avatar: 'Please select a valid image file' }));
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, avatar: 'Image size should be less than 5MB' }));
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target.result;
        setUploadedImage({ file, dataUrl });
        setFormData(prev => ({ ...prev, avatar: dataUrl }));
        setErrors(prev => ({ ...prev, avatar: undefined }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setUploadedImage(null);
    setFormData(prev => ({ ...prev, avatar: null }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = "Username can only contain letters, numbers, and underscores";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center p-4 z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl"
        >
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b border-white/10">
            <h2 className="text-lg font-semibold text-white">Edit Profile</h2>
            <button
              onClick={onClose}
              className="text-white/60 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Avatar Upload */}
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-white/10 border border-white/20 overflow-hidden flex items-center justify-center">
                  {uploadedImage ? (
                    <img
                      src={uploadedImage.dataUrl}
                      alt="Profile preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-3xl text-white/60">
                      {formData.name.charAt(0).toUpperCase() || "?"}
                    </span>
                  )}
                </div>

                {uploadedImage && (
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 rounded-full flex items-center justify-center text-white text-xs hover:bg-red-600 transition-colors"
                  >
                    ×
                  </button>
                )}
              </div>

              <label className="cursor-pointer bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-sm text-white transition-colors">
                {uploadedImage ? "Change Photo" : "Upload Photo"}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>

              {errors.avatar && (
                <p className="text-red-400 text-sm">{errors.avatar}</p>
              )}
            </div>

            {/* Name Input */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-4 py-3 bg-transparent border-2 border-white rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-ruby-accent transition-colors duration-500"
                placeholder="Enter your name"
              />
              {errors.name && (
                <p className="text-red-400 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            {/* Username Input */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Username
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white">@</span>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                  className="w-full pl-8 pr-4 py-3 bg-transparent border-2 border-white rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-ruby-accent transition-colors duration-500"
                  placeholder="username"
                />
              </div>
              {errors.username && (
                <p className="text-red-400 text-sm mt-1">{errors.username}</p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 px-4 text-white rounded-xl border-2 border-white/30 hover:border-white bg-white/20 transition-colors duration-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-3 px-4 bg-white text-black rounded-xl hover:bg-black hover:text-white hover:border-white duration-500 transition-colors font-medium"
              >
                Save Changes
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
} 