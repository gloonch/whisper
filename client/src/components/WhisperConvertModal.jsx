import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

function WhisperConvertModal({ isOpen, onClose, onConfirm }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const f = e.target.files?.[0];
    setFile(f || null);
    if (f) {
      const url = URL.createObjectURL(f);
      setPreview(url);
    } else {
      setPreview(null);
    }
  };

  const handleConfirm = async () => {
    await onConfirm(file || null);
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="absolute inset-0 bg-black/40 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />

        <motion.div
          className="relative bg-white/20 backdrop-blur-xl rounded-2xl p-6 w-full max-w-md shadow-2xl border border-white/30"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
        >
          <h2 className="text-xl font-semibold text-white mb-4">Add to Timeline</h2>
          <p className="text-sm text-white/40 mb-4">Upload an optional photo to include with this event.</p>
          <input type="file" accept="image/*" onChange={handleFileChange} className="mb-4" />
          {preview && (
            <div className="mb-4">
              <img src={preview} alt="Preview" className="w-full rounded-lg" />
            </div>
          )}
          <div className="flex space-x-3">
            <button 
            onClick={onClose} 
                className="flex-1 px-4 py-2 text-white rounded-lg border-2 border-white/30 hover:border-white bg-white/20 transition-colors duration-500">
              Cancel
            </button>
            <button 
            onClick={handleConfirm} 
            className="flex-1 px-4 py-2 bg-white text-black rounded-lg hover:bg-black hover:text-white hover:border-white duration-500 transition-colors">
            Confirm
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default WhisperConvertModal;


