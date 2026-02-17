'use client';

import { motion } from 'framer-motion';
import { BookmarkIcon } from '@/components/icons';

const EmptyState = ({ title = "No bookmarks yet", message = "Add your first bookmark to get started!" }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center py-20 px-4"
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="text-6xl mb-4"
      >
        <BookmarkIcon size={64} className="text-gray-300 dark:text-gray-700" />
      </motion.div>
      <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-400 text-center max-w-sm">
        {message}
      </p>
    </motion.div>
  );
};

export default EmptyState;
