/**
 * Playback routes for GrooveBox
 * Handles Spotify playback control functionality
 */

const express = require('express');
const router = express.Router();
const { authenticateSpotify, authenticateAdmin } = require('../middleware/auth');
const { songAdditionRateLimit } = require('../middleware/rateLimit');
const { createUserSpotifyApi, withTokenRefresh } = require('../utils/spotifyApi');

// Apply Spotify authentication middleware to all playback routes
router.use(authenticateSpotify);

// Get current playback state
router.get('/current', async (req, res) => {
  try {
    const spotifyApi = createUserSpotifyApi(
      req.session.spotifyAccessToken,
      req.session.spotifyRefreshToken
    );
    
    const data = await withTokenRefresh(
      spotifyApi,
      () => spotifyApi.getMyCurrentPlaybackState(),
      (newToken) => {
        req.session.spotifyAccessToken = newToken;
      }
    );
    
    res.json(data.body);
  } catch (error) {
    console.error('Error getting playback state:', error);
    res.status(500).json({ error: 'Failed to get playback state' });
  }
});

// Add track to queue (available to all authenticated users, but rate-limited for guests)
router.post('/queue', songAdditionRateLimit, async (req, res) => {
  const { uri } = req.body;
  
  if (!uri) {
    return res.status(400).json({ error: 'Track URI is required' });
  }
  
  try {
    const spotifyApi = createUserSpotifyApi(
      req.session.spotifyAccessToken,
      req.session.spotifyRefreshToken
    );
    
    // Get the active device ID from the admin's session or use the one from the current user
    const deviceId = req.session.activeDeviceId;
    
    await withTokenRefresh(
      spotifyApi,
      () => spotifyApi.addToQueue(uri, { device_id: deviceId }),
      (newToken) => {
        req.session.spotifyAccessToken = newToken;
      }
    );
    
    // Include rate limit information in the response for guest users
    const rateLimitInfo = res.locals.rateLimit;
    
    res.json({ 
      success: true, 
      message: 'Track added to queue',
      ...(rateLimitInfo && { rateLimit: rateLimitInfo })
    });
  } catch (error) {
    console.error('Error adding track to queue:', error);
    res.status(500).json({ error: 'Failed to add track to queue' });
  }
});

// The following routes require admin privileges
router.use(authenticateAdmin);

// Start/resume playback (admin only)
router.put('/play', async (req, res) => {
  const { context_uri, uris, offset, position_ms } = req.body;
  const deviceId = req.session.activeDeviceId;
  
  try {
    const spotifyApi = createUserSpotifyApi(
      req.session.spotifyAccessToken,
      req.session.spotifyRefreshToken
    );
    
    const options = { device_id: deviceId };
    
    // If context_uri, uris, offset, or position_ms are provided, include them in the options
    if (context_uri) options.context_uri = context_uri;
    if (uris) options.uris = uris;
    if (offset !== undefined) options.offset = offset;
    if (position_ms !== undefined) options.position_ms = position_ms;
    
    await withTokenRefresh(
      spotifyApi,
      () => spotifyApi.play(options),
      (newToken) => {
        req.session.spotifyAccessToken = newToken;
      }
    );
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error starting playback:', error);
    res.status(500).json({ error: 'Failed to start playback' });
  }
});

// Pause playback (admin only)
router.put('/pause', async (req, res) => {
  const deviceId = req.session.activeDeviceId;
  
  try {
    const spotifyApi = createUserSpotifyApi(
      req.session.spotifyAccessToken,
      req.session.spotifyRefreshToken
    );
    
    await withTokenRefresh(
      spotifyApi,
      () => spotifyApi.pause({ device_id: deviceId }),
      (newToken) => {
        req.session.spotifyAccessToken = newToken;
      }
    );
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error pausing playback:', error);
    res.status(500).json({ error: 'Failed to pause playback' });
  }
});

// Skip to next track (admin only)
router.post('/next', async (req, res) => {
  const deviceId = req.session.activeDeviceId;
  
  try {
    const spotifyApi = createUserSpotifyApi(
      req.session.spotifyAccessToken,
      req.session.spotifyRefreshToken
    );
    
    await withTokenRefresh(
      spotifyApi,
      () => spotifyApi.skipToNext({ device_id: deviceId }),
      (newToken) => {
        req.session.spotifyAccessToken = newToken;
      }
    );
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error skipping to next track:', error);
    res.status(500).json({ error: 'Failed to skip to next track' });
  }
});

// Skip to previous track (admin only)
router.post('/previous', async (req, res) => {
  const deviceId = req.session.activeDeviceId;
  
  try {
    const spotifyApi = createUserSpotifyApi(
      req.session.spotifyAccessToken,
      req.session.spotifyRefreshToken
    );
    
    await withTokenRefresh(
      spotifyApi,
      () => spotifyApi.skipToPrevious({ device_id: deviceId }),
      (newToken) => {
        req.session.spotifyAccessToken = newToken;
      }
    );
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error skipping to previous track:', error);
    res.status(500).json({ error: 'Failed to skip to previous track' });
  }
});

// Set volume (admin only)
router.put('/volume', async (req, res) => {
  const { volume_percent } = req.body;
  const deviceId = req.session.activeDeviceId;
  
  if (volume_percent === undefined || volume_percent < 0 || volume_percent > 100) {
    return res.status(400).json({ error: 'Volume percent must be between 0 and 100' });
  }
  
  try {
    const spotifyApi = createUserSpotifyApi(
      req.session.spotifyAccessToken,
      req.session.spotifyRefreshToken
    );
    
    await withTokenRefresh(
      spotifyApi,
      () => spotifyApi.setVolume(volume_percent, { device_id: deviceId }),
      (newToken) => {
        req.session.spotifyAccessToken = newToken;
      }
    );
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error setting volume:', error);
    res.status(500).json({ error: 'Failed to set volume' });
  }
});

module.exports = router;
