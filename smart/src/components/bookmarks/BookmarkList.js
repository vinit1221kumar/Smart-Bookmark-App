'use client';

import BookmarkCard from '@/components/bookmarks/BookmarkCard';
import { BookmarkCardSkeleton } from '@/components/ui/Skeleton';
import { motion, AnimatePresence } from 'framer-motion';

const BookmarkList = ({ bookmarks, loading, onDelete, onOpen }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.2 },
    },
    exit: {
      opacity: 0,
      y: -10,
      transition: { duration: 0.2 },
    },
  };

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
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <AnimatePresence mode="popLayout">
        {bookmarks.map((bookmark) => (
          <motion.div key={bookmark.id} variants={itemVariants} layout>
            <BookmarkCard
              bookmark={bookmark}
              onDelete={onDelete}
              onOpen={onOpen}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
};

export default BookmarkList;
