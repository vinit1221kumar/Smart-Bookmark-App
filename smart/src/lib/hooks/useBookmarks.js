'use client';

import { useCallback, useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/lib/contexts/ToastContext';
import { MESSAGES } from '@/lib/constants/messages';

export const useBookmarks = (userId) => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { showError, showSuccess } = useToast();
  const supabase = createClient();

  const fetchBookmarks = useCallback(async () => {
    if (!userId) return;

    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('bookmarks')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setBookmarks(data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching bookmarks:', err);
      setError(err.message);
      showError(MESSAGES.BOOKMARK_FETCH_ERROR);
    } finally {
      setLoading(false);
    }
  }, [userId, supabase, showError]);

  const addBookmark = useCallback(
    async (title, url, faviconUrl) => {
      try {
        const { data, error: insertError } = await supabase
          .from('bookmarks')
          .insert([
            {
              user_id: userId,
              title,
              url,
              favicon_url: faviconUrl,
            },
          ])
          .select();

        if (insertError) {
          if (insertError.message.includes('duplicate')) {
            showError(MESSAGES.DUPLICATE_BOOKMARK);
          } else {
            throw insertError;
          }
        } else {
          setBookmarks((prev) => [data[0], ...prev]);
          showSuccess(MESSAGES.BOOKMARK_ADDED);
        }
      } catch (err) {
        console.error('Error adding bookmark:', err);
        showError(MESSAGES.BOOKMARK_ADD_ERROR);
      }
    },
    [userId, supabase, showSuccess, showError]
  );

  const deleteBookmark = useCallback(
    async (id) => {
      try {
        const { error: deleteError } = await supabase
          .from('bookmarks')
          .delete()
          .eq('id', id);

        if (deleteError) throw deleteError;

        setBookmarks((prev) => prev.filter((b) => b.id !== id));
        showSuccess(MESSAGES.BOOKMARK_DELETED);
      } catch (err) {
        console.error('Error deleting bookmark:', err);
        showError(MESSAGES.BOOKMARK_DELETE_ERROR);
      }
    },
    [supabase, showSuccess, showError]
  );

  const incrementOpenCount = useCallback(
    async (id) => {
      try {
        await supabase.rpc('increment_open_count', { bookmark_id: id });
        setBookmarks((prev) =>
          prev.map((b) => (b.id === id ? { ...b, open_count: b.open_count + 1 } : b))
        );
      } catch (err) {
        console.error('Error incrementing open count:', err);
      }
    },
    [supabase]
  );

  useEffect(() => {
    fetchBookmarks();

    // Subscribe to realtime changes
    const channel = supabase
      .channel(`user_bookmarks:${userId}`)
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
            setBookmarks((prev) => [payload.new, ...prev]);
          } else if (payload.eventType === 'DELETE') {
            setBookmarks((prev) => prev.filter((b) => b.id !== payload.old.id));
          } else if (payload.eventType === 'UPDATE') {
            setBookmarks((prev) =>
              prev.map((b) => (b.id === payload.new.id ? payload.new : b))
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, supabase, fetchBookmarks]);

  return {
    bookmarks,
    loading,
    error,
    addBookmark,
    deleteBookmark,
    incrementOpenCount,
    refetch: fetchBookmarks,
  };
};

export default useBookmarks;
