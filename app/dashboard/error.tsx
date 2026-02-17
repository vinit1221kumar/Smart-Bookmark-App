'use client'

import { useEffect } from 'react'
import { AlertCircle } from 'lucide-react'

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Dashboard Error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
          <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>

          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Dashboard Error
            </h1>
            <p className="text-gray-600 dark:text-gray-400 max-w-md">
              {error.message || 'Failed to load your bookmarks'}
            </p>
          </div>

          <button
            onClick={() => reset()}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
          >
            Try again
          </button>
        </div>
      </div>
    </div>
  )
}
