export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      bookmarks: {
        Row: {
          id: string
          user_id: string
          title: string
          url: string
          opens: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          url: string
          opens?: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          url?: string
          opens?: number
          created_at?: string
        }
      }
    }
  }
}

export type Bookmark = Database['public']['Tables']['bookmarks']['Row']
