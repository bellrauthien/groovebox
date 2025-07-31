/**
 * Utility functions for formatting data in the GrooveBox application
 */

/**
 * Format milliseconds into a time string (MM:SS)
 * @param {number} ms - Time in milliseconds
 * @returns {string} - Formatted time string
 */
export const formatTime = (ms) => {
  if (!ms || isNaN(ms)) return '0:00';
  
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

/**
 * Format artist names from an array of artist objects
 * @param {Array} artists - Array of artist objects
 * @returns {string} - Comma-separated list of artist names
 */
export const formatArtistNames = (artists) => {
  if (!artists || !Array.isArray(artists)) return '';
  
  return artists.map(artist => artist.name).join(', ');
};

/**
 * Truncate a string if it exceeds a certain length
 * @param {string} str - String to truncate
 * @param {number} maxLength - Maximum length before truncation
 * @returns {string} - Truncated string with ellipsis if needed
 */
export const truncateString = (str, maxLength = 30) => {
  if (!str) return '';
  
  if (str.length <= maxLength) return str;
  
  return `${str.substring(0, maxLength - 3)}...`;
};

/**
 * Format a date string into a more readable format
 * @param {string} dateString - ISO date string
 * @returns {string} - Formatted date string
 */
export const formatDate = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Format track duration from milliseconds to minutes and seconds
 * @param {number} ms - Duration in milliseconds
 * @returns {string} - Formatted duration string
 */
export const formatDuration = (ms) => {
  return formatTime(ms);
};

/**
 * Format album type for display
 * @param {string} albumType - Album type from Spotify API
 * @returns {string} - Formatted album type
 */
export const formatAlbumType = (albumType) => {
  if (!albumType) return '';
  
  const types = {
    album: 'Album',
    single: 'Single',
    compilation: 'Compilation',
  };
  
  return types[albumType.toLowerCase()] || albumType;
};

/**
 * Format track number for display
 * @param {number} trackNumber - Track number
 * @returns {string} - Formatted track number
 */
export const formatTrackNumber = (trackNumber) => {
  if (!trackNumber) return '';
  
  return trackNumber.toString().padStart(2, '0');
};

/**
 * Format popularity score (0-100) into a star rating (0-5)
 * @param {number} popularity - Popularity score from Spotify API
 * @returns {string} - Star rating representation
 */
export const formatPopularity = (popularity) => {
  if (popularity === undefined || popularity === null) return '';
  
  const stars = Math.round((popularity / 100) * 5);
  return '★'.repeat(stars) + '☆'.repeat(5 - stars);
};

/**
 * Format a number with commas as thousands separators
 * @param {number} num - Number to format
 * @returns {string} - Formatted number string
 */
export const formatNumberWithCommas = (num) => {
  if (num === undefined || num === null) return '';
  
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

/**
 * Format a timestamp into a relative time string (e.g., "2 hours ago")
 * @param {number|string} timestamp - Timestamp or date string
 * @returns {string} - Relative time string
 */
export const formatRelativeTime = (timestamp) => {
  if (!timestamp) return '';
  
  const date = typeof timestamp === 'string' ? new Date(timestamp) : new Date(timestamp);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  
  if (diffInSeconds < 60) return 'just now';
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
  
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) return `${diffInMonths} month${diffInMonths !== 1 ? 's' : ''} ago`;
  
  const diffInYears = Math.floor(diffInMonths / 12);
  return `${diffInYears} year${diffInYears !== 1 ? 's' : ''} ago`;
};
