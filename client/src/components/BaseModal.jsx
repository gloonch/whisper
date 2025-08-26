import React from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * BaseModal - یک کامپوننت پایه با theme یکپارچه شیشه‌ای برای تمام modal ها
 * 
 * @param {boolean} isOpen - وضعیت باز یا بسته بودن modal
 * @param {function} onClose - تابع برای بستن modal
 * @param {ReactNode} children - محتوای modal
 * @param {string} size - اندازه modal: 'sm', 'md', 'lg', 'xl'
 * @param {boolean} closeOnBackdrop - آیا با کلیک روی backdrop بسته شود
 * @param {object} animation - تنظیمات انیمیشن کاستوم
 */
export default function BaseModal({
  isOpen,
  onClose,
  children,
  size = "md",
  closeOnBackdrop = true,
  animation = {}
}) {
  if (!isOpen) return null;

  // اندازه‌های مختلف modal
  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md", 
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl"
  };

  // انیمیشن پیش‌فرض
  const defaultAnimation = {
    initial: { opacity: 0, scale: 0.9, y: 20 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.9, y: 20 },
    transition: { type: "spring", stiffness: 300, damping: 25 }
  };

  const finalAnimation = { ...defaultAnimation, ...animation };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop شیشه‌ای */}
        <motion.div
          className="absolute inset-0 bg-black/40 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeOnBackdrop ? onClose : undefined}
        />

        {/* Modal Content */}
        <motion.div
          className={`relative bg-white/20 backdrop-blur-xl rounded-2xl p-6 w-full ${sizeClasses[size]} shadow-2xl border border-white/30`}
          initial={finalAnimation.initial}
          animate={finalAnimation.animate}
          exit={finalAnimation.exit}
          transition={finalAnimation.transition}
        >
          {children}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/**
 * ModalHeader - هدر استاندارد برای modal ها
 */
export function ModalHeader({ title, onClose, showCloseButton = true }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-xl font-semibold text-gray-900">
        {title}
      </h2>
      {showCloseButton && (
        <button
          onClick={onClose}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}

/**
 * ModalActions - دکمه‌های عملیات استاندارد
 */
export function ModalActions({ actions = [], className = "" }) {
  return (
    <div className={`flex space-x-3 pt-4 ${className}`}>
      {actions.map((action, index) => (
        <button
          key={index}
          type={action.type || "button"}
          onClick={action.onClick}
          disabled={action.disabled}
          className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
            action.variant === "primary"
              ? "bg-ruby-accent text-white hover:bg-ruby-accent/90 disabled:opacity-50"
              : action.variant === "danger"
              ? "bg-red-500 text-white hover:bg-red-600 disabled:opacity-50"
              : "bg-gray-200 text-gray-800 hover:bg-gray-300 disabled:opacity-50"
          }`}
        >
          {action.loading ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
              <span>{action.loadingText || "Loading..."}</span>
            </div>
          ) : (
            action.label
          )}
        </button>
      ))}
    </div>
  );
}
