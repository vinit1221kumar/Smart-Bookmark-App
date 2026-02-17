'use client'

import { User } from '@supabase/supabase-js'
import { LogOut, Chrome } from 'lucide-react'
import { signOut } from '@/lib/actions'
import { ThemeToggle } from './theme-toggle'
import { useTransition } from 'react'
import { toast } from 'sonner'

interface NavbarProps {
  user: User
}

export function Navbar({ user }: NavbarProps) {
  const [isPending, startTransition] = useTransition()

  const handleSignOut = () => {
    startTransition(async () => {
      await signOut()
      toast.success('Signed out successfully')
    })
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
              <Chrome className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              Smart Bookmark
            </span>
          </div>

          {/* User Info & Actions */}
          <div className="flex items-center gap-4">
            <ThemeToggle />
            
            {/* User Avatar */}
            <div className="flex items-center gap-3">
              {user.user_metadata.avatar_url && (
                <img
                  src={user.user_metadata.avatar_url}
                  alt={user.user_metadata.full_name || 'User'}
                  className="w-8 h-8 rounded-full border-2 border-gray-200 dark:border-gray-700"
                />
              )}
              <span className="hidden md:block text-sm text-gray-700 dark:text-gray-300">
                {user.user_metadata.full_name || user.email}
              </span>
            </div>

            {/* Sign Out Button */}
            <button
              onClick={handleSignOut}
              disabled={isPending}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors disabled:opacity-50"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
