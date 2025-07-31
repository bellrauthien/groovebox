/**
 * Playlist routes for GrooveBox
 * Handles playlist management functionality
 */

const express = require('express');
const router = express.Router();
const { authenticateSpotify, authenticateAdmin } = require('../middleware/auth');
const { createUserSpotifyApi, withTokenRefresh } = require('../utils/spotifyApi');

// Apply Spotify authentication middleware to all playlist routes
router.use(authenticateSpotify);

// Get user's playlists
router.get('/', async (req, res) => {
  try {
    const spotifyApi = createUserSpotifyApi(
      req.session.spotifyAccessToken,
      req.session.spotifyRefreshToken
    );
    
    const data = await withTokenRefresh(
      spotifyApi,
      () => spotifyApi.getUserPlaylists(),
      (newToken) => {
        req.session.spotifyAccessToken = newToken;
      }
    );
    
    res.json(data.body.items);
  } catch (error) {
    console.error('Error getting playlists:', error);
    res.status(500).json({ error: 'Failed to get playlists' });
  }
});

// Get a specific playlist
router.get('/:playlistId', async (req, res) => {
  const { playlistId } = req.params;
  
  try {
    const spotifyApi = createUserSpotifyApi(
      req.session.spotifyAccessToken,
      req.session.spotifyRefreshToken
    );
    
    const data = await withTokenRefresh(
      spotifyApi,
      () => spotifyApi.getPlaylist(playlistId),
      (newToken) => {
        req.session.spotifyAccessToken = newToken;
      }
    );
    
    res.json(data.body);
  } catch (error) {
    console.error('Error getting playlist:', error);
    res.status(500).json({ error: 'Failed to get playlist' });
  }
});

// Get tracks from a specific playlist
router.get('/:playlistId/tracks', async (req, res) => {
  const { playlistId } = req.params;
  
  try {
    const spotifyApi = createUserSpotifyApi(
      req.session.spotifyAccessToken,
      req.session.spotifyRefreshToken
    );
    
    const data = await withTokenRefresh(
      spotifyApi,
      () => spotifyApi.getPlaylistTracks(playlistId),
      (newToken) => {
        req.session.spotifyAccessToken = newToken;
      }
    );
    
    res.json(data.body.items);
  } catch (error) {
    console.error('Error getting playlist tracks:', error);
    res.status(500).json({ error: 'Failed to get playlist tracks' });
  }
});

// The following routes require admin privileges
router.use(authenticateAdmin);

// Create a new playlist (admin only)
router.post('/', async (req, res) => {
  const { name, description } = req.body;
  
  if (!name) {
    return res.status(400).json({ error: 'Playlist name is required' });
  }
  
  try {
    const spotifyApi = createUserSpotifyApi(
      req.session.spotifyAccessToken,
      req.session.spotifyRefreshToken
    );
    
    // Get user ID first
    const userProfile = await withTokenRefresh(
      spotifyApi,
      () => spotifyApi.getMe(),
      (newToken) => {
        req.session.spotifyAccessToken = newToken;
      }
    );
    
    const userId = userProfile.body.id;
    
    // Create the playlist
    const data = await withTokenRefresh(
      spotifyApi,
      () => spotifyApi.createPlaylist(userId, name, { 
        description: description || 'GrooveBox Jukebox Playlist',
        public: true 
      }),
      (newToken) => {
        req.session.spotifyAccessToken = newToken;
      }
    );
    
    // Store the main jukebox playlist ID in the session
    req.session.mainPlaylistId = data.body.id;
    
    res.status(201).json(data.body);
  } catch (error) {
    console.error('Error creating playlist:', error);
    res.status(500).json({ error: 'Failed to create playlist' });
  }
});

// Set main jukebox playlist (admin only)
router.put('/main', async (req, res) => {
  const { playlistId } = req.body;
  
  if (!playlistId) {
    return res.status(400).json({ error: 'Playlist ID is required' });
  }
  
  try {
    // Store the main jukebox playlist ID in the session
    req.session.mainPlaylistId = playlistId;
    
    res.json({ success: true, mainPlaylistId: playlistId });
  } catch (error) {
    console.error('Error setting main playlist:', error);
    res.status(500).json({ error: 'Failed to set main playlist' });
  }
});

// Get the main jukebox playlist
router.get('/main/info', async (req, res) => {
  const mainPlaylistId = req.session.mainPlaylistId;
  
  if (!mainPlaylistId) {
    return res.status(404).json({ error: 'No main playlist has been set' });
  }
  
  try {
    const spotifyApi = createUserSpotifyApi(
      req.session.spotifyAccessToken,
      req.session.spotifyRefreshToken
    );
    
    const data = await withTokenRefresh(
      spotifyApi,
      () => spotifyApi.getPlaylist(mainPlaylistId),
      (newToken) => {
        req.session.spotifyAccessToken = newToken;
      }
    );
    
    res.json(data.body);
  } catch (error) {
    console.error('Error getting main playlist:', error);
    res.status(500).json({ error: 'Failed to get main playlist' });
  }
});

// Add tracks to the main playlist (admin only)
router.post('/main/tracks', async (req, res) => {
  const { trackUris } = req.body;
  const mainPlaylistId = req.session.mainPlaylistId;
  
  if (!mainPlaylistId) {
    return res.status(404).json({ error: 'No main playlist has been set' });
  }
  
  if (!trackUris || !Array.isArray(trackUris) || trackUris.length === 0) {
    return res.status(400).json({ error: 'Track URIs are required' });
  }
  
  try {
    const spotifyApi = createUserSpotifyApi(
      req.session.spotifyAccessToken,
      req.session.spotifyRefreshToken
    );
    
    const data = await withTokenRefresh(
      spotifyApi,
      () => spotifyApi.addTracksToPlaylist(mainPlaylistId, trackUris),
      (newToken) => {
        req.session.spotifyAccessToken = newToken;
      }
    );
    
    res.json(data.body);
  } catch (error) {
    console.error('Error adding tracks to playlist:', error);
    res.status(500).json({ error: 'Failed to add tracks to playlist' });
  }
});

// Remove tracks from the main playlist (admin only)
router.delete('/main/tracks', async (req, res) => {
  const { tracks } = req.body;
  const mainPlaylistId = req.session.mainPlaylistId;
  
  if (!mainPlaylistId) {
    return res.status(404).json({ error: 'No main playlist has been set' });
  }
  
  if (!tracks || !Array.isArray(tracks) || tracks.length === 0) {
    return res.status(400).json({ error: 'Tracks to remove are required' });
  }
  
  try {
    const spotifyApi = createUserSpotifyApi(
      req.session.spotifyAccessToken,
      req.session.spotifyRefreshToken
    );
    
    const data = await withTokenRefresh(
      spotifyApi,
      () => spotifyApi.removeTracksFromPlaylist(mainPlaylistId, tracks),
      (newToken) => {
        req.session.spotifyAccessToken = newToken;
      }
    );
    
    res.json(data.body);
  } catch (error) {
    console.error('Error removing tracks from playlist:', error);
    res.status(500).json({ error: 'Failed to remove tracks from playlist' });
  }
});

// Reorder tracks in the main playlist (admin only)
router.put('/main/tracks/reorder', async (req, res) => {
  const { rangeStart, insertBefore } = req.body;
  const mainPlaylistId = req.session.mainPlaylistId;
  
  if (!mainPlaylistId) {
    return res.status(404).json({ error: 'No main playlist has been set' });
  }
  
  if (rangeStart === undefined || insertBefore === undefined) {
    return res.status(400).json({ error: 'Range start and insert before positions are required' });
  }
  
  try {
    const spotifyApi = createUserSpotifyApi(
      req.session.spotifyAccessToken,
      req.session.spotifyRefreshToken
    );
    
    const data = await withTokenRefresh(
      spotifyApi,
      () => spotifyApi.reorderTracksInPlaylist(mainPlaylistId, rangeStart, insertBefore),
      (newToken) => {
        req.session.spotifyAccessToken = newToken;
      }
    );
    
    res.json(data.body);
  } catch (error) {
    console.error('Error reordering tracks in playlist:', error);
    res.status(500).json({ error: 'Failed to reorder tracks in playlist' });
  }
});

module.exports = router;
