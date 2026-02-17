'use client'

import { Bookmark } from '@/types/database'
import { deleteBookmark, incrementOpens } from '@/lib/actions'
import { ExternalLink, Trash2, Copy, TrendingUp } from 'lucide-react'
import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { getFaviconUrl, extractDomain, formatDate } from '@/lib/utils'

interface BookmarkCardProps {
  bookmark: Bookmark
}

export function BookmarkCard({ bookmark }: BookmarkCardProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [isPending, startTransition] = useTransition()

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this bookmark?')) {
      setIsDeleting(true)
      startTransition(async () => {
        const result = await deleteBookmark(bookmark.id)
        if (result.error) {
          toast.error(result.error)
          setIsDeleting(false)
        } else {
          toast.success('Bookmark deleted')
        }
      })
    }
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(bookmark.url)
      toast.success('Link copied to clipboard!')
    } catch {
      toast.error('Failed to copy link')
    }
  }

  const handleOpen = () => {
    startTransition(async () => {
      await incrementOpens(bookmark.id)
    })
    window.open(bookmark.url, '_blank', 'noopener,noreferrer')
  }

  return (
    <div
      className={`group relative bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl border border-gray-200 dark:border-gray-700 p-6 transition-all duration-300 ${
        isDeleting ? 'opacity-50 scale-95' : 'hover:scale-[1.02]'
      }`}
    >
      {/* Header */}
      <div className="flex items-start gap-4 mb-4">
        {/* Favicon */}
        <div className="flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
          <img
            src={getFaviconUrl(bookmark.url)}
            alt=""
            className="w-8 h-8 object-contain"
            onError={(e) => {
              e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"%3E%3Cpath d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"%3E%3C/path%3E%3Cpath d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"%3E%3C/path%3E%3C/svg%3E'
            }}
          />
        </div>

        {/* Title & URL */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-1 truncate">
            {bookmark.title}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
            {extractDomain(bookmark.url)}
          </p>
        </div>

        {/* Opens Counter */}
        {bookmark.opens > 0 && (
          <div className="flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 rounded-full">
            <TrendingUp className="w-3 h-3 text-blue-600 dark:text-blue-400" />
            <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
              {bookmark.opens}
            </span>
          </div>
        )}
      </div>

      {/* Metadata */}
      <div className="mb-4">
        <p className="text-xs text-gray-400 dark:text-gray-500">
          Added {formatDate(bookmark.created_at)}
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={handleOpen}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
          Open
        </button>

        <button
          onClick={handleCopy}
          className="p-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
          title="Copy link"
        >
          <Copy className="w-4 h-4 text-gray-700 dark:text-gray-300" />
        </button>

        <button
          onClick={handleDelete}
          disabled={isPending}
          className="p-2 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 rounded-lg transition-colors disabled:opacity-50"
          title="Delete bookmark"
        >
          <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
        </button>
      </div>
    </div>
  )
}
