import { createServerClient as createSSRServerClient } from '@supabase/ssr'
import { SupabaseClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { Database } from '@/types/database'

/**
 * Create a strongly-typed Supabase server client with proper Database type inference
 */
export async function createServerClient(): Promise<SupabaseClient<Database>> {
  const cookieStore = await cookies()

  return createSSRServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // Set is called from a Server Component, safe to ignore
            // Middleware handles session refresh
          }
        },
        remove(name: string, options: any) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch (error) {
            // Remove is called from a Server Component, safe to ignore
            // Middleware handles session refresh
          }
        },
      },
    }
  )
}

/**
 * Type-safe wrapper for common database operations
 * Ensures proper type inference for table operations
 */
export function createTypedClient(client: SupabaseClient<Database>) {
  return {
    /**
     * Insert a bookmark with full type safety
     */
    insertBookmark: async (
      bookmark: Database['public']['Tables']['bookmarks']['Insert']
    ) => {
      return client
        .from('bookmarks')
        .insert(bookmark as any)
        .select()
        .single()
    },

    /**
     * Delete a bookmark with full type safety
     */
    deleteBookmark: async (bookmarkId: string) => {
      return client.from('bookmarks').delete().eq('id', bookmarkId)
    },

    /**
     * Get all bookmarks for a user
     */
    getBookmarks: async (userId: string) => {
      return client
        .from('bookmarks')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
    },

    /**
     * Increment opens counter via RPC
     */
    incrementOpens: async (bookmarkId: string) => {
      return client.rpc('increment_opens', {
        bookmark_id: bookmarkId,
      } as any)
    },
  }
}
