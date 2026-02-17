'use client';

import BookmarkCard from '@/components/bookmarks/BookmarkCard';
import { BookmarkCardSkeleton } from '@/components/ui/Skeleton';

const BookmarkList = ({ bookmarks, loading, onDelete, onOpen }) => {

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <BookmarkCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!bookmarks.length) {
    return null;
  }

  return (
    <div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
    >
      <div>
        {bookmarks.map((bookmark) => (
          <div key={bookmark.id}>
            <BookmarkCard
              bookmark={bookmark}
              onDelete={onDelete}
              onOpen={onOpen}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookmarkList;
