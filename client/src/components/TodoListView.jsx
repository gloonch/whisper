import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TodoListModal from './TodoListModal';

const TodoListView = ({ 
  isVisible, 
  todoList = [], 
  onClose, 
  onTodoComplete 
}) => {
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);

  const handleUploadPhoto = (todo) => {
    setSelectedTodo(todo);
    setShowUploadModal(true);
  };

  const handlePhotoUploaded = (imageUrl) => {
    if (selectedTodo) {
      onTodoComplete?.(selectedTodo, imageUrl);
      setSelectedTodo(null);
      setShowUploadModal(false);
    }
  };

  const slideVariants = {
    hidden: { 
      y: '-100%',
      opacity: 0
    },
    visible: { 
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        damping: 25,
        stiffness: 300,
        duration: 0.5
      }
    },
    exit: { 
      y: '-100%',
      opacity: 0,
      transition: {
        duration: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        duration: 0.3
      }
    }
  };

  return (
    <>
      <AnimatePresence>
        {isVisible && (
          <motion.div
            className="absolute inset-0 z-50 bg-bg-deep"
            variants={slideVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <h2 className="text-xl font-semibold text-white">My To-Do List</h2>
              <motion.button
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {todoList.length > 0 ? (
                <motion.div 
                  className="space-y-3"
                  initial="hidden"
                  animate="visible"
                  variants={{
                    visible: {
                      transition: {
                        staggerChildren: 0.1
                      }
                    }
                  }}
                >
                  {todoList.map((todo) => (
                    <motion.div
                      key={todo.id}
                      className="bg-white/10 rounded-xl p-4 border border-white/20"
                      variants={itemVariants}
                      whileHover={{ scale: 1.01 }}
                      layout
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="text-white font-medium mb-1">{todo.title}</h3>
                          <p className="text-white/60 text-sm">Mark as completed</p>
                        </div>

                        <motion.button
                          onClick={() => handleUploadPhoto(todo)}
                          className="ml-4 w-10 h-10 bg-white/10 hover:bg-ruby-accent/20 border-2 border-white/30 hover:border-ruby-accent rounded-lg transition-colors flex items-center justify-center"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <svg className="w-5 h-5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div 
                  className="flex flex-col items-center justify-center py-20"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="text-6xl mb-4">✅</div>
                  <h3 className="text-white/80 text-lg font-medium mb-2">All done!</h3>
                  <p className="text-white/60 text-sm text-center">
                    You've completed all your to-dos.<br />
                    Browse explore ideas to add more.
                  </p>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upload Modal */}
      <TodoListModal
        isVisible={showUploadModal}
        todo={selectedTodo}
        onClose={() => {
          setShowUploadModal(false);
          setSelectedTodo(null);
        }}
        onPhotoUploaded={handlePhotoUploaded}
      />
    </>
  );
};

export default TodoListView; 