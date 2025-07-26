import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-bg-deep p-8 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md mx-auto"
      >
        {/* 404 Icon */}
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <svg className="w-16 h-16 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </motion.div>

        {/* Error Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h1 className="text-4xl font-bold text-cream mb-3">404</h1>
          <h2 className="text-xl font-semibold text-cream mb-2">Page Not Found</h2>
          <p className="text-mist-blue mb-8 leading-relaxed">
            The page you're looking for doesn't exist. 
            <br />
            It might have been moved or deleted.
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="space-y-4"
        >
          <Link
            to="/"
            className="block w-full bg-ruby-accent hover:bg-ruby-accent/80 text-white py-3 px-6 rounded-xl font-medium transition-colors"
          >
            Back to Timeline
          </Link>
          
          <div className="flex space-x-3">
            <Link
              to="/whispers"
              className="flex-1 bg-white/10 hover:bg-white/20 text-cream py-2.5 px-4 rounded-xl text-sm font-medium transition-colors"
            >
              Whispers
            </Link>
            <Link
              to="/me"
              className="flex-1 bg-white/10 hover:bg-white/20 text-cream py-2.5 px-4 rounded-xl text-sm font-medium transition-colors"
            >
              Profile
            </Link>
          </div>
        </motion.div>

        {/* Decorative Elements */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-8 text-4xl opacity-20"
        >
          💔
        </motion.div>
      </motion.div>
    </div>
  );
}

export default NotFound; 