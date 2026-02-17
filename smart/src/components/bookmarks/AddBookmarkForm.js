'use client';

import { useEffect, useRef, useState } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import { extractFaviconUrl } from '@/lib/utils/favicon';
import { normalizeUrl, validateBookmark } from '@/lib/utils/validators';
import { useToast } from '@/lib/contexts/ToastContext';
import { MESSAGES } from '@/lib/constants/messages';

const AddBookmarkForm = ({ onAdd, loading = false }) => {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [errors, setErrors] = useState({});
  const titleInputRef = useRef(null);
  const { showError } = useToast();

  // Keyboard shortcut: Press "N" to focus input
  useEffect(() => {
    const handleKeyPress = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        titleInputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate
    const validation = validateBookmark({ title, url });
    if (!validation.valid) {
      setErrors({ form: validation.error });
      showError(validation.error);
      return;
    }

    const normalizedUrl = normalizeUrl(url);
    const faviconUrl = extractFaviconUrl(normalizedUrl);

    try {
      await onAdd(title, normalizedUrl, faviconUrl);
      setTitle('');
      setUrl('');
      setErrors({});
      titleInputRef.current?.focus();
    } catch (err) {
      console.error('Error adding bookmark:', err);
      showError(MESSAGES.BOOKMARK_ADD_ERROR);
    }
  };

  return (
    <div>
      <Card className="p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">Add New Bookmark</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            ref={titleInputRef}
            type="text"
            placeholder="Bookmark title (Ctrl+N)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            error={errors.title}
            disabled={loading}
          />

          <Input
            type="url"
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            error={errors.url}
            disabled={loading}
          />

          {errors.form && (
            <p className="text-red-600 dark:text-red-400 text-sm">
              {errors.form}
            </p>
          )}

          <Button
            type="submit"
            disabled={loading || !title.trim() || !url.trim()}
            className="w-full"
          >
            {loading ? 'Adding...' : 'Add Bookmark'}
          </Button>
        </form>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
          💡 Tip: Press Ctrl+N to quickly add a bookmark
        </p>
      </Card>
    </div>
  );
};

export default AddBookmarkForm;
