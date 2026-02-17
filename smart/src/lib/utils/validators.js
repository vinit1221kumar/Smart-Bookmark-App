/**
 * Validates a URL format
 * @param {string} url - URL to validate
 * @returns {boolean} - True if valid URL
 */
export const isValidUrl = (url) => {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
};

/**
 * Sanitizes a title string
 * @param {string} title - Title to sanitize
 * @returns {string} - Sanitized title
 */
export const sanitizeTitle = (title) => {
  return title
    .trim()
    .slice(0, 200)
    .replace(/[<>]/g, '');
};

/**
 * Validates bookmark data
 * @param {{ title: string, url: string }} bookmark - Bookmark object
 * @returns {{ valid: boolean, error?: string }}
 */
export const validateBookmark = (bookmark) => {
  if (!bookmark.title || bookmark.title.trim().length === 0) {
    return { valid: false, error: 'Title is required' };
  }

  if (!bookmark.url || bookmark.url.trim().length === 0) {
    return { valid: false, error: 'URL is required' };
  }

  if (!isValidUrl(bookmark.url)) {
    return { valid: false, error: 'Invalid URL format' };
  }

  if (bookmark.title.length > 200) {
    return { valid: false, error: 'Title cannot exceed 200 characters' };
  }

  return { valid: true };
};

/**
 * Normalizes URL (adds https if no protocol)
 * @param {string} url - URL to normalize
 * @returns {string} - Normalized URL
 */
export const normalizeUrl = (url) => {
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return 'https://' + url;
  }
  return url;
};
