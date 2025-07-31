import axios from 'axios';

const API_URL = 'http://127.0.0.1:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Authentication services
export const authService = {
  // Admin login with 6-digit code
  adminLogin: (adminCode) => {
    return api.post('/auth/admin-login', { adminCode });
  },
  
  // Get Spotify login URL
  getSpotifyLoginUrl: () => {
    return api.get('/auth/spotify-login');
  },
  
  // Check authentication status
  checkAuthStatus: () => {
    return api.get('/auth/status');
  },
  
  // Logout
  logout: () => {
    return api.post('/auth/logout');
  },
};

// Playlist services
export const playlistService = {
  // Get user's playlists
  getUserPlaylists: () => {
    return api.get('/playlists');
  },
  
  // Get a specific playlist
  getPlaylist: (playlistId) => {
    return api.get(`/playlists/${playlistId}`);
  },
  
  // Get tracks from a specific playlist
  getPlaylistTracks: (playlistId) => {
    return api.get(`/playlists/${playlistId}/tracks`);
  },
  
  // Create a new playlist (admin only)
  createPlaylist: (name, description) => {
    return api.post('/playlists', { name, description });
  },
  
  // Set main jukebox playlist (admin only)
  setMainPlaylist: (playlistId) => {
    return api.put('/playlists/main', { playlistId });
  },
  
  // Get the main jukebox playlist
  getMainPlaylist: () => {
    return api.get('/playlists/main/info');
  },
  
  // Add tracks to the main playlist (admin only)
  addTracksToMainPlaylist: (trackUris) => {
    return api.post('/playlists/main/tracks', { trackUris });
  },
  
  // Remove tracks from the main playlist (admin only)
  removeTracksFromMainPlaylist: (tracks) => {
    return api.delete('/playlists/main/tracks', { data: { tracks } });
  },
  
  // Reorder tracks in the main playlist (admin only)
  reorderTracksInMainPlaylist: (rangeStart, insertBefore) => {
    return api.put('/playlists/main/tracks/reorder', { rangeStart, insertBefore });
  },
};

// Playback services
export const playbackService = {
  // Get current playback state
  getCurrentPlayback: () => {
    return api.get('/playback/current');
  },
  
  // Add track to queue
  addTrackToQueue: (uri) => {
    return api.post('/playback/queue', { uri });
  },
  
  // Start/resume playback (admin only)
  play: (options = {}) => {
    return api.put('/playback/play', options);
  },
  
  // Pause playback (admin only)
  pause: () => {
    return api.put('/playback/pause');
  },
  
  // Skip to next track (admin only)
  skipToNext: () => {
    return api.post('/playback/next');
  },
  
  // Skip to previous track (admin only)
  skipToPrevious: () => {
    return api.post('/playback/previous');
  },
  
  // Set volume (admin only)
  setVolume: (volumePercent) => {
    return api.put('/playback/volume', { volume_percent: volumePercent });
  },
};

// Admin services
export const adminService = {
  // Get available devices for playback
  getDevices: () => {
    return api.get('/admin/devices');
  },
  
  // Set active device for playback
  setActiveDevice: (deviceId) => {
    return api.put('/admin/device', { deviceId });
  },
  
  // Clear the playback queue
  clearQueue: () => {
    return api.delete('/admin/queue');
  },
  
  // Get application statistics
  getStats: () => {
    return api.get('/admin/stats');
  },
};

// Search services
export const searchService = {
  // Search Spotify catalog
  search: (query, type = 'track', limit = 20, offset = 0) => {
    return api.get('/search', { params: { query, type, limit, offset } });
  },
  
  // Get track details
  getTrack: (trackId) => {
    return api.get(`/search/track/${trackId}`);
  },
  
  // Get artist details
  getArtist: (artistId) => {
    return api.get(`/search/artist/${artistId}`);
  },
  
  // Get artist's top tracks
  getArtistTopTracks: (artistId, country = 'US') => {
    return api.get(`/search/artist/${artistId}/top-tracks`, { params: { country } });
  },
  
  // Get album details
  getAlbum: (albumId) => {
    return api.get(`/search/album/${albumId}`);
  },
  
  // Get album tracks
  getAlbumTracks: (albumId, limit = 50, offset = 0) => {
    return api.get(`/search/album/${albumId}/tracks`, { params: { limit, offset } });
  },
};

export default {
  authService,
  playlistService,
  playbackService,
  adminService,
  searchService,
};
