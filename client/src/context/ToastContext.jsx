import React, { createContext, useContext } from 'react';
import useModernToast from '../hooks/useModernToast';
import ModernToast from '../components/ModernToast';

const ToastContext = createContext();

export const useGlobalToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useGlobalToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const { toast, showSuccess, showError, showWarning, showInfo, hideToast } = useModernToast();

  const value = {
    showSuccess,
    showError,
    showWarning,
    showInfo,
    hideToast
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      
      {/* Global Toast */}
      <ModernToast
        title={toast.title}
        subtitle={toast.subtitle}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </ToastContext.Provider>
  );
};
