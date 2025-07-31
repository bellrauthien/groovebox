/**
 * Search routes for GrooveBox
 * Handles Spotify catalog search functionality
 */

const express = require('express');
const router = express.Router();
const { authenticateSpotify } = require('../middleware/auth');
const { createUserSpotifyApi, withTokenRefresh } = require('../utils/spotifyApi');

// Apply Spotify authentication middleware to all search routes
router.use(authenticateSpotify);

// Search Spotify catalog
router.get('/', async (req, res) => {
  const { query, type = 'track', limit = 20, offset = 0 } = req.query;
  
  if (!query) {
    return res.status(400).json({ error: 'Search query is required' });
  }
  
  try {
    const spotifyApi = createUserSpotifyApi(
      req.session.spotifyAccessToken,
      req.session.spotifyRefreshToken
    );
    
    const data = await withTokenRefresh(
      spotifyApi,
      () => spotifyApi.search(query, [type], { limit, offset }),
      (newToken) => {
        req.session.spotifyAccessToken = newToken;
      }
    );
    
    res.json(data.body);
  } catch (error) {
    console.error('Error searching Spotify catalog:', error);
    res.status(500).json({ error: 'Failed to search Spotify catalog' });
  }
});

// Get track details
router.get('/track/:trackId', async (req, res) => {
  const { trackId } = req.params;
  
  try {
    const spotifyApi = createUserSpotifyApi(
      req.session.spotifyAccessToken,
      req.session.spotifyRefreshToken
    );
    
    const data = await withTokenRefresh(
      spotifyApi,
      () => spotifyApi.getTrack(trackId),
      (newToken) => {
        req.session.spotifyAccessToken = newToken;
      }
    );
    
    res.json(data.body);
  } catch (error) {
    console.error('Error getting track details:', error);
    res.status(500).json({ error: 'Failed to get track details' });
  }
});

// Get artist details
router.get('/artist/:artistId', async (req, res) => {
  const { artistId } = req.params;
  
  try {
    const spotifyApi = createUserSpotifyApi(
      req.session.spotifyAccessToken,
      req.session.spotifyRefreshToken
    );
    
    const data = await withTokenRefresh(
      spotifyApi,
      () => spotifyApi.getArtist(artistId),
      (newToken) => {
        req.session.spotifyAccessToken = newToken;
      }
    );
    
    res.json(data.body);
  } catch (error) {
    console.error('Error getting artist details:', error);
    res.status(500).json({ error: 'Failed to get artist details' });
  }
});

// Get artist's top tracks
router.get('/artist/:artistId/top-tracks', async (req, res) => {
  const { artistId } = req.params;
  const { country = 'US' } = req.query;
  
  try {
    const spotifyApi = createUserSpotifyApi(
      req.session.spotifyAccessToken,
      req.session.spotifyRefreshToken
    );
    
    const data = await withTokenRefresh(
      spotifyApi,
      () => spotifyApi.getArtistTopTracks(artistId, country),
      (newToken) => {
        req.session.spotifyAccessToken = newToken;
      }
    );
    
    res.json(data.body);
  } catch (error) {
    console.error('Error getting artist top tracks:', error);
    res.status(500).json({ error: 'Failed to get artist top tracks' });
  }
});

// Get album details
router.get('/album/:albumId', async (req, res) => {
  const { albumId } = req.params;
  
  try {
    const spotifyApi = createUserSpotifyApi(
      req.session.spotifyAccessToken,
      req.session.spotifyRefreshToken
    );
    
    const data = await withTokenRefresh(
      spotifyApi,
      () => spotifyApi.getAlbum(albumId),
      (newToken) => {
        req.session.spotifyAccessToken = newToken;
      }
    );
    
    res.json(data.body);
  } catch (error) {
    console.error('Error getting album details:', error);
    res.status(500).json({ error: 'Failed to get album details' });
  }
});

// Get album tracks
router.get('/album/:albumId/tracks', async (req, res) => {
  const { albumId } = req.params;
  const { limit = 50, offset = 0 } = req.query;
  
  try {
    const spotifyApi = createUserSpotifyApi(
      req.session.spotifyAccessToken,
      req.session.spotifyRefreshToken
    );
    
    const data = await withTokenRefresh(
      spotifyApi,
      () => spotifyApi.getAlbumTracks(albumId, { limit, offset }),
      (newToken) => {
        req.session.spotifyAccessToken = newToken;
      }
    );
    
    res.json(data.body);
  } catch (error) {
    console.error('Error getting album tracks:', error);
    res.status(500).json({ error: 'Failed to get album tracks' });
  }
});

module.exports = router;
