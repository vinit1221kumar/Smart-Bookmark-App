'use client';

import { useState, useEffect } from 'react';
import Input from '@/components/ui/Input';
import { SearchIcon } from '@/components/icons';
import { motion } from 'framer-motion';

const BookmarkSearch = ({ onSearch, placeholder = 'Search bookmarks...' }) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, onSearch]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: 0.1 }}
      className="mb-6"
    >
      <div className="relative">
        <SearchIcon
          size={20}
          className="absolute left-3 top-3 text-gray-400"
        />
        <Input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10"
        />
      </div>
    </motion.div>
  );
};

export default BookmarkSearch;
