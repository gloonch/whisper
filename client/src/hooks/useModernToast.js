import { useState } from 'react';

const useModernToast = () => {
  const [toast, setToast] = useState({
    isVisible: false,
    title: '',
    subtitle: '',
    type: 'SUCCESS'
  });

  const showToast = (title, subtitle = '', type = 'SUCCESS') => {
    setToast({
      isVisible: true,
      title,
      subtitle,
      type
    });
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, isVisible: false }));
  };

  // Convenience methods
  const showSuccess = (title, subtitle = '') => {
    showToast(title, subtitle, 'SUCCESS');
  };

  const showError = (title, subtitle = '') => {
    showToast(title, subtitle, 'ERROR');
  };

  const showWarning = (title, subtitle = '') => {
    showToast(title, subtitle, 'WARNING');
  };

  const showInfo = (title, subtitle = '') => {
    showToast(title, subtitle, 'INFO');
  };

  return {
    toast,
    showToast,
    hideToast,
    showSuccess,
    showError,
    showWarning,
    showInfo
  };
};

export default useModernToast;
