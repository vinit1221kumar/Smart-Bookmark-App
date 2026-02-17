'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Bookmark } from '@/types/database'
import { BookmarkCard } from './bookmark-card'
import { EmptyState } from './empty-state'
import { Search } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface BookmarkListProps {
  initialBookmarks: Bookmark[]
  userId: string
}

export function BookmarkList({ initialBookmarks, userId }: BookmarkListProps) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(initialBookmarks)
  const [searchQuery, setSearchQuery] = useState('')
  const supabase = createClient()

  // Real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('bookmarks-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookmarks',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setBookmarks((current) => [payload.new as Bookmark, ...current])
          } else if (payload.eventType === 'DELETE') {
            setBookmarks((current) =>
              current.filter((bookmark) => bookmark.id !== payload.old.id)
            )
          } else if (payload.eventType === 'UPDATE') {
            setBookmarks((current) =>
              current.map((bookmark) =>
                bookmark.id === payload.new.id
                  ? (payload.new as Bookmark)
                  : bookmark
              )
            )
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [userId])

  // Filter bookmarks based on search
  const filteredBookmarks = bookmarks.filter(
    (bookmark) =>
      bookmark.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bookmark.url.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      {bookmarks.length > 0 && (
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search bookmarks..."
            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all shadow-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              Clear
            </button>
          )}
        </div>
      )}

      {/* Results Count */}
      {searchQuery && (
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Found {filteredBookmarks.length} bookmark{filteredBookmarks.length !== 1 ? 's' : ''}
        </p>
      )}

      {/* Bookmarks Grid */}
      {filteredBookmarks.length === 0 && !searchQuery ? (
        <EmptyState />
      ) : filteredBookmarks.length === 0 && searchQuery ? (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">
            No bookmarks found matching "{searchQuery}"
          </p>
        </div>
      ) : (
        <motion.div
          layout
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredBookmarks.map((bookmark, index) => (
              <motion.div
                key={bookmark.id}
                layout
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -20 }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.05,
                  type: 'spring',
                  stiffness: 300,
                  damping: 30,
                }}
              >
                <BookmarkCard bookmark={bookmark} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  )
}
