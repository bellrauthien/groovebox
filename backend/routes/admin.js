/**
 * Admin routes for GrooveBox
 * Handles admin-specific functionality
 */

const express = require('express');
const router = express.Router();
const { authenticateAdmin, authenticateSpotify } = require('../middleware/auth');
const { createUserSpotifyApi, withTokenRefresh } = require('../utils/spotifyApi');

// Apply authentication middleware to all admin routes
router.use(authenticateAdmin);
router.use(authenticateSpotify);

// Get available devices for playback
router.get('/devices', async (req, res) => {
  try {
    const spotifyApi = createUserSpotifyApi(
      req.session.spotifyAccessToken,
      req.session.spotifyRefreshToken
    );
    
    const data = await withTokenRefresh(
      spotifyApi,
      () => spotifyApi.getMyDevices(),
      (newToken) => {
        req.session.spotifyAccessToken = newToken;
      }
    );
    
    res.json(data.body.devices);
  } catch (error) {
    console.error('Error getting devices:', error);
    res.status(500).json({ error: 'Failed to get devices' });
  }
});

// Set active device for playback
router.put('/device', async (req, res) => {
  const { deviceId } = req.body;
  
  if (!deviceId) {
    return res.status(400).json({ error: 'Device ID is required' });
  }
  
  try {
    const spotifyApi = createUserSpotifyApi(
      req.session.spotifyAccessToken,
      req.session.spotifyRefreshToken
    );
    
    await withTokenRefresh(
      spotifyApi,
      () => spotifyApi.transferMyPlayback([deviceId]),
      (newToken) => {
        req.session.spotifyAccessToken = newToken;
      }
    );
    
    // Store active device in session
    req.session.activeDeviceId = deviceId;
    
    res.json({ success: true, deviceId });
  } catch (error) {
    console.error('Error setting active device:', error);
    res.status(500).json({ error: 'Failed to set active device' });
  }
});

// Clear the playback queue
router.delete('/queue', async (req, res) => {
  try {
    // Note: Spotify API doesn't provide a direct way to clear the queue
    // We'll implement this by stopping playback and then restarting it
    const spotifyApi = createUserSpotifyApi(
      req.session.spotifyAccessToken,
      req.session.spotifyRefreshToken
    );
    
    // Get currently playing track
    const currentlyPlaying = await withTokenRefresh(
      spotifyApi,
      () => spotifyApi.getMyCurrentPlayingTrack(),
      (newToken) => {
        req.session.spotifyAccessToken = newToken;
      }
    );
    
    // If something is playing, pause it
    if (currentlyPlaying.body && currentlyPlaying.body.is_playing) {
      await withTokenRefresh(
        spotifyApi,
        () => spotifyApi.pause(),
        (newToken) => {
          req.session.spotifyAccessToken = newToken;
        }
      );
      
      // Resume playback of the current track (this effectively clears the queue)
      if (currentlyPlaying.body.item) {
        await withTokenRefresh(
          spotifyApi,
          () => spotifyApi.play({
            uris: [currentlyPlaying.body.item.uri]
          }),
          (newToken) => {
            req.session.spotifyAccessToken = newToken;
          }
        );
      }
    }
    
    res.json({ success: true, message: 'Queue cleared' });
  } catch (error) {
    console.error('Error clearing queue:', error);
    res.status(500).json({ error: 'Failed to clear queue' });
  }
});

// Get application statistics
router.get('/stats', (req, res) => {
  // This would typically connect to a database to get stats
  // For now, we'll return mock data
  res.json({
    totalSongsQueued: 0,
    totalGuestUsers: 0,
    popularSongs: []
  });
});

module.exports = router;
