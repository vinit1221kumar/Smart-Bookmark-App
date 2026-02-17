'use client'

import { Bookmark } from 'lucide-react'

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      {/* Icon */}
      <div className="mb-6 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 opacity-20 blur-3xl rounded-full" />
        <div className="relative flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30">
          <Bookmark className="w-12 h-12 text-blue-600 dark:text-blue-400" />
        </div>
      </div>

      {/* Text */}
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        No bookmarks yet
      </h3>
      <p className="text-gray-600 dark:text-gray-400 max-w-md mb-6">
        Start building your collection by adding your first bookmark above.
        Save your favorite websites and access them anytime, anywhere.
      </p>

      {/* Quick Tip */}
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <span className="text-sm text-blue-700 dark:text-blue-300">
          💡 Pro tip: Press <kbd className="px-2 py-1 text-xs font-semibold bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded">N</kbd> to quickly add a bookmark
        </span>
      </div>
    </div>
  )
}
