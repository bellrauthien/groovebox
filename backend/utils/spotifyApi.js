/**
 * Spotify API utility functions for GrooveBox
 * Handles Spotify API client creation and token refresh
 */

const SpotifyWebApi = require('spotify-web-api-node');

/**
 * Create a new Spotify API client with the provided credentials
 * @param {Object} credentials - Spotify API credentials
 * @returns {SpotifyWebApi} - Spotify API client instance
 */
const createSpotifyApi = (credentials = {}) => {
  return new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    redirectUri: process.env.REDIRECT_URI,
    ...credentials
  });
};

/**
 * Create a Spotify API client with user credentials
 * @param {string} accessToken - User's Spotify access token
 * @param {string} refreshToken - User's Spotify refresh token
 * @returns {SpotifyWebApi} - Spotify API client instance with user credentials
 */
const createUserSpotifyApi = (accessToken, refreshToken) => {
  const spotifyApi = createSpotifyApi();
  spotifyApi.setAccessToken(accessToken);
  spotifyApi.setRefreshToken(refreshToken);
  return spotifyApi;
};

/**
 * Refresh the access token using the refresh token
 * @param {SpotifyWebApi} spotifyApi - Spotify API client instance
 * @returns {Promise<string>} - New access token
 */
const refreshAccessToken = async (spotifyApi) => {
  try {
    const data = await spotifyApi.refreshAccessToken();
    const accessToken = data.body.access_token;
    spotifyApi.setAccessToken(accessToken);
    return accessToken;
  } catch (error) {
    console.error('Error refreshing access token:', error);
    throw error;
  }
};

/**
 * Handle API calls with automatic token refresh on 401 errors
 * @param {SpotifyWebApi} spotifyApi - Spotify API client instance
 * @param {Function} apiCall - Function that makes the Spotify API call
 * @param {Function} onTokenRefresh - Callback to handle the refreshed token
 * @returns {Promise<any>} - Result of the API call
 */
const withTokenRefresh = async (spotifyApi, apiCall, onTokenRefresh) => {
  try {
    return await apiCall();
  } catch (error) {
    // If token expired (401), refresh and try again
    if (error.statusCode === 401) {
      const newAccessToken = await refreshAccessToken(spotifyApi);
      if (onTokenRefresh) {
        onTokenRefresh(newAccessToken);
      }
      return await apiCall();
    }
    throw error;
  }
};

module.exports = {
  createSpotifyApi,
  createUserSpotifyApi,
  refreshAccessToken,
  withTokenRefresh
};
