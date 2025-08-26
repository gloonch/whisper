import React, { useState } from "react";
import BaseModal, { ModalHeader, ModalActions } from "./BaseModal";

/**
 * مثالی از استفاده صحیح BaseModal برای modal های جدید
 */
export default function ExampleModal({ isOpen, onClose }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false);
    onClose();
  };

  const actions = [
    {
      label: "Cancel",
      onClick: onClose,
      variant: "secondary"
    },
    {
      label: "Save",
      onClick: handleSave,
      variant: "primary",
      type: "submit",
      loading: isLoading,
      loadingText: "Saving...",
      disabled: isLoading
    }
  ];

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      closeOnBackdrop={!isLoading}
    >
      <ModalHeader 
        title="Example Modal" 
        onClose={onClose}
        showCloseButton={!isLoading}
      />
      
      <div className="space-y-4">
        <p className="text-gray-600">
          This is an example of using the BaseModal component with consistent theming.
        </p>
        
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-bg-deep mb-2">Features:</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Glassmorphism backdrop (bg-black/40 backdrop-blur-md)</li>
            <li>• Translucent modal (bg-white/95 backdrop-blur-xl)</li>
            <li>• Consistent animations and transitions</li>
            <li>• Standardized header and actions</li>
            <li>• Multiple size options</li>
          </ul>
        </div>
      </div>

      <ModalActions actions={actions} />
    </BaseModal>
  );
}

/**
 * نحوه استفاده در والد:
 * 
 * const [showExample, setShowExample] = useState(false);
 * 
 * return (
 *   <>
 *     <button onClick={() => setShowExample(true)}>
 *       Show Example Modal
 *     </button>
 *     
 *     <ExampleModal 
 *       isOpen={showExample} 
 *       onClose={() => setShowExample(false)} 
 *     />
 *   </>
 * );
 */
