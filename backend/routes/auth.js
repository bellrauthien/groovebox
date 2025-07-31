/**
 * Authentication routes for GrooveBox
 * Handles admin authentication and Spotify OAuth flow
 */

const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { verifyAdminCode } = require('../middleware/auth');
const { createSpotifyApi } = require('../utils/spotifyApi');

// Spotify API scopes needed for the application
const SPOTIFY_SCOPES = [
  'user-read-private',
  'user-read-email',
  'user-read-playback-state',
  'user-modify-playback-state',
  'user-read-currently-playing',
  'playlist-read-private',
  'playlist-read-collaborative',
  'playlist-modify-public',
  'playlist-modify-private'
];

// Admin login route
router.post('/admin-login', (req, res) => {
  const { adminCode } = req.body;
  const expectedCode = process.env.ADMIN_CODE;
  
  console.log('Admin login attempt:', { 
    receivedCode: adminCode, 
    receivedType: typeof adminCode,
    expectedCode: expectedCode,
    expectedType: typeof expectedCode,
    match: String(adminCode) === String(expectedCode)
  });
  
  // Convert both to strings to avoid type mismatches
  if (String(adminCode) === String(expectedCode)) {
    req.session.isAdmin = true;
    req.session.userId = 'admin-' + uuidv4();
    console.log('Admin login successful');
    return res.status(200).json({ success: true, isAdmin: true });
  }
  
  console.log('Admin login failed');
  return res.status(401).json({ success: false, error: 'Invalid admin code' });
});

// Debug route to check environment variables
router.get('/debug-env', (req, res) => {
  res.json({
    adminCodeSet: !!process.env.ADMIN_CODE,
    adminCodeLength: process.env.ADMIN_CODE ? process.env.ADMIN_CODE.length : 0,
    nodeEnv: process.env.NODE_ENV
  });
});

// Generate Spotify authorization URL
router.get('/spotify-login', (req, res) => {
  const spotifyApi = createSpotifyApi();
  const state = uuidv4();
  
  // Store state in session to verify callback
  req.session.spotifyAuthState = state;
  
  // Generate authorization URL
  const authorizeURL = spotifyApi.createAuthorizeURL(
    SPOTIFY_SCOPES,
    state
  );
  
  res.json({ url: authorizeURL });
});

// Spotify callback route
router.get('/callback', async (req, res) => {
  const { code, state } = req.query;
  
  // Verify state to prevent CSRF attacks
  if (state !== req.session.spotifyAuthState) {
    return res.status(400).json({ error: 'State mismatch' });
  }
  
  try {
    const spotifyApi = createSpotifyApi();
    
    // Exchange authorization code for access token
    const data = await spotifyApi.authorizationCodeGrant(code);
    
    // Extract tokens
    const { access_token, refresh_token, expires_in } = data.body;
    
    // Store tokens in session
    req.session.spotifyAccessToken = access_token;
    req.session.spotifyRefreshToken = refresh_token;
    req.session.spotifyTokenExpiry = Date.now() + expires_in * 1000;
    
    // If not already set (for admin), generate a user ID
    if (!req.session.userId) {
      req.session.userId = 'guest-' + uuidv4();
    }
    
    // Get user profile to store username
    spotifyApi.setAccessToken(access_token);
    const userProfile = await spotifyApi.getMe();
    req.session.spotifyUsername = userProfile.body.display_name || userProfile.body.id;
    
    // Redirect to frontend
    res.redirect(`${process.env.CLIENT_URL}/auth-success`);
  } catch (error) {
    console.error('Error during Spotify authorization:', error);
    res.redirect(`${process.env.CLIENT_URL}/auth-error`);
  }
});

// Check authentication status
router.get('/status', (req, res) => {
  res.json({
    isAuthenticated: !!req.session.spotifyAccessToken,
    isAdmin: !!req.session.isAdmin,
    username: req.session.spotifyUsername || null
  });
});

// Logout route
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to logout' });
    }
    res.clearCookie('connect.sid');
    res.json({ success: true });
  });
});

module.exports = router;
