// Extract domain from URL
export function extractDomain(url: string): string {
  try {
    const urlObj = new URL(url)
    return urlObj.hostname.replace('www.', '')
  } catch {
    return url
  }
}

// Get favicon URL from Google's service
export function getFaviconUrl(url: string): string {
  try {
    const domain = extractDomain(url)
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`
  } catch {
    // Return a data URI for a generic globe icon
    return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"%3E%3Ccircle cx="32" cy="32" r="30" fill="%23e5e7eb"/%3E%3Cpath d="M32 4a28 28 0 1 0 0 56 28 28 0 0 0 0-56z" fill="none" stroke="%239ca3af" stroke-width="2"/%3E%3C/svg%3E'
  }
}

// Format date
export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) return 'just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`
  
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  })
}

// Truncate text
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text
  return text.slice(0, length) + '...'
}
