/**
 * Formats a date to relative time (e.g., '2 hours ago')
 * @param {string|Date} date - Date to format
 * @returns {string} - Relative time string
 */
export const formatRelativeTime = (date) => {
  const now = new Date();
  const timestamp = new Date(date);
  const segundos = Math.floor((now - timestamp) / 1000);

  if (segundos < 60) return 'just now';
  if (segundos < 3600) return `${Math.floor(segundos / 60)}m ago`;
  if (segundos < 86400) return `${Math.floor(segundos / 3600)}h ago`;
  if (segundos < 604800) return `${Math.floor(segundos / 86400)}d ago`;

  return timestamp.toLocaleDateString();
};

/**
 * Formats a date for display
 * @param {string|Date} date - Date to format
 * @returns {string} - Formatted date
 */
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Formats a date with time
 * @param {string|Date} date - Date to format
 * @returns {string} - Formatted date and time
 */
export const formatDateTime = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Truncates text to specified length
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} - Truncated text
 */
export const truncateText = (text, maxLength = 50) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Extracts title from URL (if no title provided)
 * @param {string} url - URL
 * @returns {string} - Title
 */
export const extractTitleFromUrl = (url) => {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.replace(/^www\./, '').split('.')[0];
  } catch {
    return 'Bookmark';
  }
};
