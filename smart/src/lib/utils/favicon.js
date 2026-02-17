/**
 * Extracts favicon URL from a domain
 * @param {string} url - Full URL
 * @returns {string} - Favicon URL
 */
export const extractFaviconUrl = (url) => {
  try {
    const urlObj = new URL(url);
    return `https://www.google.com/s2/favicons?sz=64&domain=${urlObj.hostname}`;
  } catch {
    return 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10"/></svg>';
  }
};

/**
 * Extracts domain from URL
 * @param {string} url - Full URL
 * @returns {string} - Domain name
 */
export const extractDomain = (url) => {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch {
    return 'Unknown';
  }
};

/**
 * Gets domain display name (without www)
 * @param {string} url - Full URL
 * @returns {string} - Display name
 */
export const getDomainDisplayName = (url) => {
  const domain = extractDomain(url);
  return domain.replace(/^www\./, '');
};
