/**
 * Utility functions for working with Spotify data in the GrooveBox application
 */

/**
 * Get the best available image from a Spotify object (album, artist, playlist)
 * @param {Object} item - Spotify object with images array
 * @param {string} size - Desired size ('small', 'medium', 'large')
 * @returns {string} - URL of the best matching image
 */
export const getBestImage = (item, size = 'medium') => {
  if (!item || !item.images || !item.images.length) {
    return '/assets/default-cover.png';
  }
  
  // Sort images by size (width)
  const sortedImages = [...item.images].sort((a, b) => b.width - a.width);
  
  // Select image based on desired size
  switch (size) {
    case 'small':
      return sortedImages[sortedImages.length - 1]?.url || sortedImages[0]?.url;
    case 'large':
      return sortedImages[0]?.url;
    case 'medium':
    default:
      return sortedImages[Math.floor(sortedImages.length / 2)]?.url || sortedImages[0]?.url;
  }
};

/**
 * Extract Spotify ID from a Spotify URI
 * @param {string} uri - Spotify URI (e.g., "spotify:track:4iV5W9uYEdYUVa79Axb7Rh")
 * @returns {string} - Extracted ID
 */
export const extractIdFromUri = (uri) => {
  if (!uri) return '';
  
  const parts = uri.split(':');
  return parts[parts.length - 1];
};

/**
 * Create a Spotify URI from an ID and type
 * @param {string} id - Spotify ID
 * @param {string} type - Type of resource (track, album, artist, playlist)
 * @returns {string} - Spotify URI
 */
export const createSpotifyUri = (id, type = 'track') => {
  if (!id) return '';
  
  return `spotify:${type}:${id}`;
};

/**
 * Get a color palette from an album artwork
 * This is a placeholder function that would typically use a color extraction library
 * @param {string} imageUrl - URL of the album artwork
 * @returns {Object} - Object containing color values
 */
export const getColorPaletteFromArtwork = (imageUrl) => {
  // In a real implementation, this would use a library like Vibrant.js
  // to extract colors from the image
  // For now, we'll return a default retro color palette
  return {
    primary: '#e63946',    // Vintage red
    secondary: '#f1faee',  // Off-white
    tertiary: '#a8dadc',   // Light blue
    dark: '#1d3557',       // Dark blue
    light: '#f9c74f',      // Gold/yellow
    vibrant: '#e63946',    // Vibrant accent color
    muted: '#457b9d',      // Muted accent color
  };
};

/**
 * Check if a track is currently playing
 * @param {Object} currentTrack - Current track object
 * @param {string} trackId - ID of the track to check
 * @returns {boolean} - Whether the track is currently playing
 */
export const isTrackPlaying = (currentTrack, trackId) => {
  if (!currentTrack || !trackId) return false;
  
  return extractIdFromUri(currentTrack.uri) === trackId;
};

/**
 * Get a human-readable error message from Spotify API errors
 * @param {Object} error - Error object from Spotify API
 * @returns {string} - Human-readable error message
 */
export const getSpotifyErrorMessage = (error) => {
  if (!error) return 'An unknown error occurred';
  
  // Check for Spotify API specific error format
  if (error.response && error.response.data) {
    const { error: spotifyError } = error.response.data;
    
    if (spotifyError) {
      if (spotifyError.message) return spotifyError.message;
      if (spotifyError.status === 401) return 'Authentication error. Please log in again.';
      if (spotifyError.status === 403) return 'You don\'t have permission to perform this action.';
      if (spotifyError.status === 429) return 'Rate limit exceeded. Please try again later.';
    }
  }
  
  // Fallback to generic error message
  return error.message || 'An error occurred while communicating with Spotify';
};

/**
 * Format explicit content indicator
 * @param {boolean} isExplicit - Whether the track has explicit content
 * @returns {string} - Formatted indicator or empty string
 */
export const formatExplicitContent = (isExplicit) => {
  return isExplicit ? 'E' : '';
};

/**
 * Get the appropriate icon name for a Spotify object type
 * @param {string} type - Spotify object type (track, album, artist, playlist)
 * @returns {string} - Icon name
 */
export const getIconForType = (type) => {
  switch (type) {
    case 'track':
      return 'music-note';
    case 'album':
      return 'album';
    case 'artist':
      return 'person';
    case 'playlist':
      return 'list';
    default:
      return 'music-note';
  }
};

/**
 * Calculate remaining time for rate limiting
 * @param {Object} rateLimit - Rate limit information
 * @returns {string} - Formatted remaining time
 */
export const calculateRateLimitRemaining = (rateLimit) => {
  if (!rateLimit || !rateLimit.resetTime) return '';
  
  const now = Date.now();
  const resetTime = new Date(rateLimit.resetTime).getTime();
  const timeRemaining = resetTime - now;
  
  if (timeRemaining <= 0) return 'You can add songs now';
  
  const minutes = Math.ceil(timeRemaining / 60000);
  return `You can add another song in ${minutes} minute${minutes !== 1 ? 's' : ''}`;
};
