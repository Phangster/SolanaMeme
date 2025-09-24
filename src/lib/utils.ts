/**
 * Utility functions for the application
 */

/**
 * Truncates a Solana wallet address for display purposes
 * @param wallet - The full wallet address
 * @param startLength - Number of characters to show at the start (default: 4)
 * @param endLength - Number of characters to show at the end (default: 4)
 * @returns Truncated wallet address in format "1234...5678"
 */
export function truncateWallet(wallet: string, startLength: number = 4, endLength: number = 4): string {
  if (!wallet || wallet.length <= startLength + endLength) {
    return wallet;
  }
  return `${wallet.slice(0, startLength)}...${wallet.slice(-endLength)}`;
}

/**
 * Formats a timestamp into a human-readable "time ago" string
 * @param dateString - ISO date string
 * @returns Human-readable time ago string (e.g., "2m", "1h", "3d")
 */
export function formatTimeAgo(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes}m`;
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
  if (diffInMinutes < 10080) return `${Math.floor(diffInMinutes / 1440)}d`;
  
  // For longer periods, show weeks ago
  const diffInWeeks = Math.floor(diffInMinutes / 10080);
  if (diffInWeeks < 4) return `${diffInWeeks}w ago`;
  
  // For very old content, show months
  const diffInMonths = Math.floor(diffInMinutes / 43200); // ~30 days
  if (diffInMonths < 12) return `${diffInMonths}mo ago`;
  
  // For very old content, show years
  const diffInYears = Math.floor(diffInMinutes / 525600); // ~365 days
  return `${diffInYears}y ago`;
}

/**
 * Validates if a string is a valid Solana wallet address
 * @param address - Address to validate
 * @returns True if valid Solana address format
 */
export function isValidSolanaAddress(address: string): boolean {
  // Basic validation for Solana address format
  return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address);
}

/**
 * Capitalizes the first letter of a string
 * @param str - String to capitalize
 * @returns String with first letter capitalized
 */
export function capitalize(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
