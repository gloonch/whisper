import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  WHISPER_TYPES, 
  WHISPER_CATEGORIES, 
  RECURRENCE_OPTIONS,
  getWhispersByCategory,
  createWhisperData 
} from "./WhisperTypes";

function WhisperModal({ isOpen, onClose, onSave, selectedDate }) {
  const [selectedCategory, setSelectedCategory] = useState("shared");
  const [selectedType, setSelectedType] = useState(null);
  const [customText, setCustomText] = useState("");
  const [recurrence, setRecurrence] = useState("once");
  const [errors, setErrors] = useState({});

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedCategory("shared");
      setSelectedType(null);
      setCustomText("");
      setRecurrence("once");
      setErrors({});
    }
  }, [isOpen]);



  const validateForm = () => {
    const newErrors = {};
    
    if (!selectedType) {
      newErrors.type = "Please select a whisper type";
    }
    
    if (selectedType === "CUSTOM" && !customText.trim()) {
      newErrors.customText = "Custom text is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const whisperData = createWhisperData({
      type: WHISPER_TYPES[selectedType].id,
      customText: selectedType === "CUSTOM" ? customText : "",
      recurrence,
      date: selectedDate.toISOString().split('T')[0]
    });

    onSave(whisperData);
    onClose();
  };

  const getTypesForCategory = (category) => {
    return Object.entries(WHISPER_TYPES).filter(([key, type]) => type.category === category);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black/40 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          className="relative bg-white/20 backdrop-blur-xl rounded-2xl p-6 w-full max-w-lg shadow-2xl border border-white/30 max-h-[90vh] overflow-y-auto"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">
              Add New Whisper
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Date Info */}
            {/* <div className="p-3 rounded-lg">
              <p className="text-sm font-medium text-white">
                {selectedDate.toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div> */}

            {/* Category Selection */}
            <div>
              <label className="block text-sm font-medium text-white mb-3">
                Category
              </label>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(WHISPER_CATEGORIES).map(([key, category]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => {
                      setSelectedCategory(key);
                      setSelectedType(null);
                    }}
                    className={`p-3 rounded-xl border-2 text-sm font-medium transition-all ${
                      selectedCategory === key
                        ? 'border-ruby-accent bg-ruby-accent/10 text-ruby-accent'
                        : 'border-gray-200 hover:border-gray-300 text-white'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{category.icon}</span>
                      <span>{category.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Type Selection */}
            <div>
              <label className="block text-sm font-medium text-white mb-3">
                Whisper Type *
              </label>
              <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
                {getTypesForCategory(selectedCategory).map(([key, type]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setSelectedType(key)}
                    className={`p-3 rounded-xl border-2 text-left transition-all ${
                      selectedType === key
                        ? 'border-ruby-accent bg-ruby-accent/10 text-ruby-accent'
                        : 'border-gray-200 hover:border-gray-300 text-white'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-xl">{type.emoji}</span>
                      <span className="font-medium">{type.label}</span>
                    </div>
                  </button>
                ))}
              </div>
              {errors.type && <p className="text-red-500 text-xs mt-1">{errors.type}</p>}
            </div>

            {/* Custom Text (if custom type selected) */}
            {selectedType === "CUSTOM" && (
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Custom Text *
                </label>
                <input
                  type="text"
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  className={`w-full px-3 py-2 border-2 border-white bg-transparent text-white rounded-lg focus:border-ruby-accent duration-500 focus:outline-none ${
                    errors.customText ? 'border-red-500' : ''
                  }`}
                  placeholder="e.g., Remember to smile today"
                />
                {errors.customText && <p className="text-red-500 text-xs mt-1">{errors.customText}</p>}
              </div>
            )}

            {/* Recurrence Selection */}
            <div>
              <label className="block text-sm font-medium text-white mb-3">
                Frequency
              </label>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(RECURRENCE_OPTIONS).map(([key, option]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setRecurrence(option.id)}
                    className={`p-3 rounded-xl border-2 text-sm font-medium transition-all ${
                      recurrence === option.id
                        ? 'border-ruby-accent bg-ruby-accent/10 text-ruby-accent'
                        : 'border-gray-200 hover:border-gray-300 text-white'
                    }`}
                  >
                    <div className="text-center">
                      <div className="font-medium">{option.label}</div>
                      <div className="text-xs opacity-70 mt-1">{option.description}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 text-white rounded-lg border-2 border-white/30 hover:border-white bg-white/20 transition-colors duration-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-white text-black rounded-lg hover:bg-black hover:text-white hover:border-white duration-500 transition-colors"
              >
                Add Whisper
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default WhisperModal; 