import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TOAST_TYPES = {
  SUCCESS: {
    bgColor: 'bg-emerald-600/90',
    iconBg: 'bg-emerald-500',
    icon: '✓',
    borderColor: 'border-emerald-400/30',
    iconShadow: 'rgba(16, 185, 129, 0.4)'
  },
  ERROR: {
    bgColor: 'bg-red-600/90',
    iconBg: 'bg-red-500',
    icon: '✕',
    borderColor: 'border-red-400/30',
    iconShadow: 'rgba(239, 68, 68, 0.4)'
  },
  WARNING: {
    bgColor: 'bg-yellow-600/90',
    iconBg: 'bg-yellow-500',
    icon: '!',
    borderColor: 'border-yellow-400/30',
    iconShadow: 'rgba(245, 158, 11, 0.4)'
  },
  INFO: {
    bgColor: 'bg-blue-600/90',
    iconBg: 'bg-blue-500',
    icon: 'i',
    borderColor: 'border-blue-400/30',
    iconShadow: 'rgba(59, 130, 246, 0.4)'
  }
};

const ModernToast = ({ 
  title, 
  subtitle, 
  type = 'SUCCESS', 
  isVisible, 
  onClose, 
  duration = 3000 
}) => {
  const toastConfig = TOAST_TYPES[type] || TOAST_TYPES.SUCCESS;

  React.useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onClose?.();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed bottom-28 transform -translate-x-1/2 z-[110] w-[90%] max-w-[400px]"
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        >
          <div className={`
            bg-transparent backdrop-blur-lg 
            ${toastConfig.borderColor} border 
            rounded-2xl px-4 py-4 shadow-xl 
            flex items-center gap-3 relative
          `}
          style={{
            boxShadow: `0 0 20px ${toastConfig.iconShadow}, 0 4px 20px rgba(0, 0, 0, 0.3)`
          }}>
            {/* Icon */}
            <div className={`
              ${toastConfig.iconBg} 
              w-8 h-8 rounded-full 
              flex items-center justify-center 
              text-white font-bold text-sm
              flex-shrink-0
            `}>
              {toastConfig.icon}
            </div>
            
            {/* Content */}
            <div className="flex-1 min-w-0">
              <h4 className="text-white font-semibold text-sm leading-tight">
                {title}
              </h4>
              {subtitle && (
                <p className="text-white/80 text-xs mt-0.5 leading-relaxed">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ModernToast;
