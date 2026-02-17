export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  CALLBACK: '/auth/callback',
};

export const PROTECTED_ROUTES = [ROUTES.DASHBOARD];

export const AUTH_ROUTES = [ROUTES.LOGIN, ROUTES.CALLBACK];

export const SITE_CONFIG = {
  name: 'Smart Bookmark',
  description: 'Your personal bookmark manager with real-time sync',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
};
