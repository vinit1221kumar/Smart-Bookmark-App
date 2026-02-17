/**
 * @typedef {Object} Bookmark
 * @property {string} id - Unique identifier (UUID)
 * @property {string} user_id - User ID (UUID)
 * @property {string} title - Bookmark title
 * @property {string} url - Bookmark URL
 * @property {string} [favicon_url] - URL to favicon
 * @property {string} [description] - Bookmark description
 * @property {number} open_count - Number of times opened
 * @property {string} created_at - Creation timestamp
 * @property {string} updated_at - Last update timestamp
 */

/**
 * @typedef {Object} User
 * @property {string} id - User ID (UUID)
 * @property {string} email - User email
 * @property {string} [user_metadata] - User metadata from OAuth
 */

/**
 * @typedef {Object} Session
 * @property {User} user - Current user
 * @property {string} access_token - JWT access token
 * @property {string} refresh_token - Refresh token
 */

/**
 * @typedef {Object} Toast
 * @property {string} id - Toast ID
 * @property {string} message - Toast message
 * @property {string} type - 'success' | 'error' | 'info' | 'warning'
 * @property {number} duration - Display duration in ms
 */

export {};
