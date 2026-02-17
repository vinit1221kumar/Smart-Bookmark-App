'use client'

import { useEffect } from 'react'
import { AlertCircle, HomeIcon } from 'lucide-react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('App Error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 space-y-6 border border-gray-200 dark:border-gray-700">
        {/* Error Icon */}
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
        </div>

        {/* Error Message */}
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Something went wrong
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {error.message || 'An unexpected error occurred'}
          </p>
        </div>

        {/* Error Digest */}
        {error.digest && (
          <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
            <p className="text-xs text-gray-500 dark:text-gray-400 break-all font-mono">
              {error.digest}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <button
            onClick={() => reset()}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Try again
          </button>
          <Link
            href="/"
            className="flex-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <HomeIcon className="w-4 h-4" />
            Home
          </Link>
        </div>
      </div>
    </div>
  )
}
