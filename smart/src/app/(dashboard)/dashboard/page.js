'use client';

import { useState, useCallback, useMemo } from 'react';
import { useAuth } from '@/lib/contexts/AuthContext';
import Container from '@/components/layout/Container';
import AddBookmarkForm from '@/components/bookmarks/AddBookmarkForm';
import BookmarkSearch from '@/components/bookmarks/BookmarkSearch';
import BookmarkList from '@/components/bookmarks/BookmarkList';
import EmptyState from '@/components/bookmarks/EmptyState';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import useBookmarks from '@/lib/hooks/useBookmarks';

export const dynamic = 'force-dynamic';

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const { bookmarks, loading, addBookmark, deleteBookmark, incrementOpenCount } =
    useBookmarks(user?.id);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter bookmarks based on search query
  const filteredBookmarks = useMemo(() => {
    if (!searchQuery.trim()) return bookmarks;

    const query = searchQuery.toLowerCase();
    return bookmarks.filter(
      (bookmark) =>
        bookmark.title.toLowerCase().includes(query) ||
        bookmark.url.toLowerCase().includes(query)
    );
  }, [bookmarks, searchQuery]);

  const handleSearch = useCallback((query) => {
    setSearchQuery(query);
  }, []);

  const handleAddBookmark = useCallback(
    async (title, url, faviconUrl) => {
      await addBookmark(title, url, faviconUrl);
    },
    [addBookmark]
  );

  const handleDeleteBookmark = useCallback(
    async (id) => {
      await deleteBookmark(id);
    },
    [deleteBookmark]
  );

  const handleOpenBookmark = useCallback(
    (id) => {
      incrementOpenCount(id);
    },
    [incrementOpenCount]
  );

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <Container>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          My Bookmarks
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Manage and organize your bookmarks in one place
        </p>
      </div>

      {/* Add Bookmark Form */}
      <AddBookmarkForm onAdd={handleAddBookmark} loading={loading} />

      {/* Bookmarks Section */}
      {bookmarks.length > 0 && (
        <>
          {/* Search Bar */}
          <BookmarkSearch onSearch={handleSearch} />

          {/* Results Count */}
          {searchQuery && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Found {filteredBookmarks.length} bookmark
              {filteredBookmarks.length !== 1 ? 's' : ''}
            </p>
          )}

          {/* Bookmarks List or Empty Search */}
          {filteredBookmarks.length > 0 ? (
            <BookmarkList
              bookmarks={filteredBookmarks}
              loading={loading}
              onDelete={handleDeleteBookmark}
              onOpen={handleOpenBookmark}
            />
          ) : (
            <EmptyState
              title="No results found"
              message={`No bookmarks match "${searchQuery}". Try a different search.`}
            />
          )}
        </>
      )}

      {/* Empty State */}
      {!loading && bookmarks.length === 0 && (
        <EmptyState
          title="No bookmarks yet"
          message="Add your first bookmark using the form above to get started!"
        />
      )}
    </Container>
  );
}
