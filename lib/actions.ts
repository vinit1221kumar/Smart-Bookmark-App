'use server'

import { createServerClient, createTypedClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { Database } from '@/types/database'

// Validation schemas
const bookmarkSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title is too long'),
  url: z.string().url('Invalid URL format').refine(
    (url) => url.startsWith('http://') || url.startsWith('https://'),
    'URL must start with http:// or https://'
  ),
})

// Add a new bookmark
export async function addBookmark(formData: FormData) {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Unauthorized' }
  }

  const title = formData.get('title') as string
  const url = formData.get('url') as string

  // Validate input
  const validation = bookmarkSchema.safeParse({ title, url })
  if (!validation.success) {
    return { error: validation.error.errors[0].message }
  }

  // Create strongly-typed bookmark object
  const bookmarkData: Database['public']['Tables']['bookmarks']['Insert'] = {
    user_id: user.id,
    title: validation.data.title,
    url: validation.data.url,
  }

  // Insert bookmark using properly typed client
  const { data, error } = await supabase
    .from('bookmarks')
    .insert(bookmarkData as any)
    .select()
    .single()

  if (error) {
    console.error('Error adding bookmark:', error)
    return { error: 'Failed to add bookmark' }
  }

  revalidatePath('/dashboard')
  return { success: true, data }
}

// Delete a bookmark
export async function deleteBookmark(bookmarkId: string) {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Unauthorized' }
  }

  // Delete bookmark (RLS ensures user can only delete their own)
  const { error } = await supabase
    .from('bookmarks')
    .delete()
    .eq('id', bookmarkId)
    .eq('user_id', user.id)

  if (error) {
    console.error('Error deleting bookmark:', error)
    return { error: 'Failed to delete bookmark' }
  }

  revalidatePath('/dashboard')
  return { success: true }
}

// Increment open counter
export async function incrementOpens(bookmarkId: string) {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Unauthorized' }
  }

  // Increment opens counter
  const { error } = await supabase.rpc('increment_opens' as any, {
    bookmark_id: bookmarkId,
  } as any)

  if (error) {
    console.error('Error incrementing opens:', error)
    return { error: 'Failed to update counter' }
  }

  revalidatePath('/dashboard')
  return { success: true }
}

// Sign out
export async function signOut() {
  const supabase = await createServerClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
}
