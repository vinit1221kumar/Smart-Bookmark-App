'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  CopyIcon,
  DeleteIcon,
  ExternalLinkIcon,
} from '@/components/icons';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { useToast } from '@/lib/contexts/ToastContext';
import { formatRelativeTime } from '@/lib/utils/formatters';
import { MESSAGES } from '@/lib/constants/messages';

const BookmarkCard = ({ bookmark, onDelete, onOpen }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { showSuccess } = useToast();

  const handleDelete = async () => {
    if (confirm(MESSAGES.CONFIRM_DELETE)) {
      setIsDeleting(true);
      await onDelete(bookmark.id);
      setIsDeleting(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(bookmark.url);
    showSuccess(MESSAGES.LINK_COPIED);
  };

  const handleOpenBookmark = () => {
    window.open(bookmark.url, '_blank');
    onOpen(bookmark.id);
  };

  return (
    <Card
      hover
      className="p-4 flex flex-col gap-3 group transition-all duration-200"
    >
      {/* Header with Favicon and Title */}
      <div className="flex gap-3 items-start">
        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden">
          {!imageError && bookmark.favicon_url ? (
            <img
              src={bookmark.favicon_url}
              alt="favicon"
              width={32}
              height={32}
              onError={() => setImageError(true)}
              className="w-full h-full"
            />
          ) : (
            <span className="text-xs font-bold">🔖</span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm md:text-base truncate">
            {bookmark.title}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
            {new URL(bookmark.url).hostname}
          </p>
        </div>
      </div>

      {/* Metadata */}
      <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
        <span>{formatRelativeTime(bookmark.created_at)}</span>
        <span className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
          Opened {bookmark.open_count} times
        </span>
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          size="sm"
          variant="secondary"
          onClick={handleOpenBookmark}
          className="flex-1 flex items-center justify-center gap-1"
        >
          <ExternalLinkIcon size={14} />
          Open
        </Button>
        <Button
          size="sm"
          variant="secondary"
          onClick={handleCopyLink}
          title="Copy link"
          className="px-2"
        >
          <CopyIcon size={14} />
        </Button>
        <Button
          size="sm"
          variant="danger"
          onClick={handleDelete}
          disabled={isDeleting}
          title="Delete bookmark"
          className="px-2"
        >
          <DeleteIcon size={14} />
        </Button>
      </div>
    </Card>
  );
};

export default BookmarkCard;
