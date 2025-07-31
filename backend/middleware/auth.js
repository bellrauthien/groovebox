/**
 * Authentication middleware for GrooveBox
 * Handles admin authentication and Spotify token verification
 */

// Admin authentication middleware
const authenticateAdmin = (req, res, next) => {
  // Check if user is authenticated as admin
  if (req.session.isAdmin) {
    return next();
  }
  return res.status(401).json({ error: 'Unauthorized: Admin access required' });
};

// Spotify authentication middleware
const authenticateSpotify = (req, res, next) => {
  // Check if user has valid Spotify access token
  if (req.session.spotifyAccessToken) {
    return next();
  }
  return res.status(401).json({ error: 'Unauthorized: Spotify authentication required' });
};

// Verify admin code middleware
const verifyAdminCode = (req, res, next) => {
  const { adminCode } = req.body;
  
  // Check if admin code matches the one in .env
  if (adminCode === process.env.ADMIN_CODE) {
    req.session.isAdmin = true;
    return next();
  }
  return res.status(401).json({ error: 'Invalid admin code' });
};

module.exports = {
  authenticateAdmin,
  authenticateSpotify,
  verifyAdminCode
};
