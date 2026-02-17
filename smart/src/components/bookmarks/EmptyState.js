'use client';

import { BookmarkIcon } from '@/components/icons';

const EmptyState = ({ title = "No bookmarks yet", message = "Add your first bookmark to get started!" }) => {
  return (
    <div
      className="flex flex-col items-center justify-center py-20 px-4"
    >
      <div
        className="text-6xl mb-4"
      >
        <BookmarkIcon size={64} className="text-gray-300 dark:text-gray-700" />
      </div>
      <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-400 text-center max-w-sm">
        {message}
      </p>
    </div>
  );
};

export default EmptyState;
