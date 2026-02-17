'use client';

import { useState, useEffect } from 'react';
import Input from '@/components/ui/Input';
import { SearchIcon } from '@/components/icons';

const BookmarkSearch = ({ onSearch, placeholder = 'Search bookmarks...' }) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, onSearch]);

  return (
    <div
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
    </div>
  );
};

export default BookmarkSearch;
