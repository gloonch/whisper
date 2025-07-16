import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const EVENT_TYPES = [
  { value: "MEETING", label: "First Meeting", color: "#FFDF6E" },
  { value: "TRIP", label: "Trip", color: "#4DA8FF" },
  { value: "PARTY", label: "Party", color: "#FF66A8" },
  { value: "BIRTHDAY", label: "Birthday", color: "#B588FF" },
  { value: "ANNIVERSARY", label: "Anniversary", color: "#FF9A3C" },
  { value: "DATE", label: "Date", color: "#7CE38B" },
  { value: "FIGHT_MAKEUP", label: "Fight & Makeup", color: "#9D9D9D" },
];

export default function EventModal({ 
  isOpen, 
  onClose, 
  onSave, 
  onDelete, 
  event = null, // null for add mode, event object for edit/view mode
  mode = "add", // "add", "edit", or "view"
  onModeChange,
  prefilledDate = null, // Date prefilled from DateSelector (for Whispers page)
  hideDate = false // Hide date input when opened from specific date context
}) {
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    type: "DATE",
    imageUrl: "",
  });

  const [uploadedImage, setUploadedImage] = useState(null); // {file, dataUrl}

  const [errors, setErrors] = useState({});
  const [isDeleting, setIsDeleting] = useState(false);

  const isEditMode = mode === "edit";
  const isViewMode = mode === "view";

  useEffect(() => {
    if (isOpen) {
      if (event && (isEditMode || isViewMode)) {
        setFormData({
          title: event.title || "",
          date: event.date || "",
          type: event.type || "DATE",
          imageUrl: event.imageUrl || "",
        });
        // Load existing image if available
        if (event.imageUrl && event.imageUrl.startsWith('data:')) {
          setUploadedImage({
            dataUrl: event.imageUrl,
            file: null
          });
        } else {
          setUploadedImage(null);
        }
      } else {
        // Add mode - check if date is prefilled from DateSelector
        const initialDate = prefilledDate 
          ? prefilledDate.toISOString().split('T')[0]
          : "";
          
        setFormData({
          title: "",
          date: initialDate,
          type: "DATE",
          imageUrl: "",
        });
        setUploadedImage(null);
      }
      setErrors({});
      setIsDeleting(false);
    }
  }, [isOpen, event, mode, isEditMode, isViewMode, prefilledDate]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }
    
    // Only validate date if it's not prefilled (when date input is shown)
    if (!hideDate || !prefilledDate) {
      if (!formData.date) {
        newErrors.date = "Date is required";
      } else {
        const selectedDate = new Date(formData.date);
        const today = new Date();
        today.setHours(23, 59, 59, 999); // End of today
        
        if (selectedDate > today) {
          newErrors.date = "Date cannot be in the future";
        }
      }
    }
    
    if (!formData.type) {
      newErrors.type = "Event type is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const dataUrl = event.target.result;
          setUploadedImage({
            file: file,
            dataUrl: dataUrl
          });
          setFormData({
            ...formData,
            imageUrl: dataUrl
          });
          
          // Store in localStorage for later backend upload
          const imageKey = `temp_image_${Date.now()}`;
          localStorage.setItem(imageKey, dataUrl);
        };
        reader.readAsDataURL(file);
      } else {
        alert('لطفاً فقط فایل‌های تصویری انتخاب کنید');
      }
    }
  };

  const handleRemoveImage = () => {
    setUploadedImage(null);
    setFormData({
      ...formData,
      imageUrl: ""
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const eventData = {
        ...formData,
        id: isEditMode ? event.id : Date.now().toString(),
        title: formData.title.trim(),
        imageUrl: uploadedImage ? uploadedImage.dataUrl : formData.imageUrl
      };
      onSave(eventData);
      onClose();
    }
  };

  const handleDelete = () => {
    if (isEditMode && onDelete) {
      setIsDeleting(true);
      setTimeout(() => {
        onDelete(event.id);
        onClose();
      }, 300);
    }
  };

  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  const getSelectedTypeColor = () => {
    const selectedType = EVENT_TYPES.find(type => type.value === formData.type);
    return selectedType ? selectedType.color : "#7CE38B";
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
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          className="relative bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-bg-deep">
              {isViewMode ? "Event Details" : isEditMode ? "Edit Event" : "Add New Event"}
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

          {/* Content */}
                    {isViewMode ? (
            /* View Mode */
            <div className="space-y-6">
              {/* Large Image Preview */}
              <div className="text-center">
                <div
                  className="w-32 h-32 mx-auto rounded-2xl border-4 border-white shadow-xl flex items-center justify-center overflow-hidden"
                  style={{ backgroundColor: getSelectedTypeColor() }}
                >
                  {(formData.imageUrl || uploadedImage) ? (
                    <img
                      src={uploadedImage ? uploadedImage.dataUrl : formData.imageUrl}
                      alt="event"
                      className="w-full h-full object-cover rounded-2xl"
                    />
                  ) : (
                    <span className="text-5xl">
                      {formData.type === 'MEETING' && '💕'}
                      {formData.type === 'TRIP' && '✈️'}
                      {formData.type === 'PARTY' && '🎉'}
                      {formData.type === 'BIRTHDAY' && '🎂'}
                      {formData.type === 'ANNIVERSARY' && '💐'}
                      {formData.type === 'DATE' && '💖'}
                      {formData.type === 'FIGHT_MAKEUP' && '🕊️'}
                    </span>
                  )}
                </div>
              </div>

              {/* Event Info */}
              <div className="text-center space-y-3">
                <h3 className="text-2xl font-bold text-bg-deep">{formData.title}</h3>
                <p className="text-lg text-gray-600 font-medium">{formatDateForInput(formData.date)}</p>
                <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-full">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: getSelectedTypeColor() }}
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {EVENT_TYPES.find(t => t.value === formData.type)?.label}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    if (onModeChange) {
                      onModeChange("edit");
                    }
                  }}
                  className="flex-1 px-4 py-2 bg-ruby-accent text-white rounded-lg hover:bg-ruby-accent/90 transition-colors"
                >
                  ✏️ Edit Event
                </button>
                {onDelete && (
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
                  >
                    {isDeleting ? "Deleting..." : "🗑️ Delete"}
                  </button>
                )}
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            /* Form Mode (Add/Edit) */
            <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-bg-deep mb-2">
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-ruby-accent ${
                  errors.title ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., Our first date"
              />
              {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
            </div>

            {/* Date - Hidden when opened from specific date context */}
            {!hideDate && (
              <div>
                <label className="block text-sm font-medium text-bg-deep mb-2">
                  Date *
                </label>
                <input
                  type="date"
                  value={formatDateForInput(formData.date)}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-ruby-accent ${
                    errors.date ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
              </div>
            )}

            {/* Show selected date info when date input is hidden */}
            {hideDate && prefilledDate && (
              <div className="p-3 bg-gray-50 rounded-lg border">
                <label className="block text-sm font-medium text-bg-deep mb-1">
                  Selected Date
                </label>
                <p className="text-gray-700 font-medium">
                  {prefilledDate.toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </p>
              </div>
            )}

            {/* Event Type */}
            <div>
              <label className="block text-sm font-medium text-bg-deep mb-2">
                Event Type *
              </label>
              <div className="grid grid-cols-2 gap-2">
                {EVENT_TYPES.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, type: type.value })}
                    className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                      formData.type === type.value
                        ? 'border-ruby-accent bg-ruby-accent/10 text-ruby-accent'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: type.color }}
                      />
                      <span>{type.label}</span>
                    </div>
                  </button>
                ))}
              </div>
              {errors.type && <p className="text-red-500 text-xs mt-1">{errors.type}</p>}
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-bg-deep mb-2">
                Image (optional)
              </label>
              
              {!uploadedImage ? (
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-ruby-accent hover:bg-ruby-accent/5 transition-colors flex items-center justify-center space-x-2"
                  >
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span className="text-gray-600">Upload Image</span>
                  </label>
                </div>
              ) : (
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <img
                    src={uploadedImage.dataUrl}
                    alt="Uploaded"
                    className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-700">
                      {uploadedImage.file ? uploadedImage.file.name : 'Image uploaded'}
                    </p>
                    <p className="text-xs text-gray-500">Click to remove</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )}
            </div>

            {/* Buttons */}
            <div className="flex space-x-3 pt-4">
              {isEditMode && onDelete && (
                <motion.button
                  type="button"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
                  animate={{ scale: isDeleting ? 0.95 : 1 }}
                >
                  {isDeleting ? "Deleting..." : "🗑️ Delete"}
                </motion.button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-ruby-accent text-white rounded-lg hover:bg-ruby-accent/90 transition-colors"
              >
                {isEditMode ? "Save Changes" : "Add Event"}
              </button>
            </div>
          </form>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}