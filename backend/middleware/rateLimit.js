/**
 * Rate limiting middleware for GrooveBox
 * Limits guest users to adding a maximum of 3 songs per hour to the queue
 */

const { rateLimit } = require('express-rate-limit');

// Create a store to track song additions by user
const songAdditionStore = new Map();

// Clean up expired entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [userId, entries] of songAdditionStore.entries()) {
    // Remove entries older than 1 hour
    const filteredEntries = entries.filter(
      timestamp => now - timestamp < 60 * 60 * 1000
    );
    
    if (filteredEntries.length === 0) {
      songAdditionStore.delete(userId);
    } else {
      songAdditionStore.set(userId, filteredEntries);
    }
  }
}, 15 * 60 * 1000); // Clean up every 15 minutes

// Custom rate limiting middleware for song additions
const songAdditionRateLimit = (req, res, next) => {
  // Skip rate limiting for admin users
  if (req.session.isAdmin) {
    return next();
  }

  const userId = req.session.userId;
  if (!userId) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  // Get or initialize user's song addition timestamps
  const userAdditions = songAdditionStore.get(userId) || [];
  
  // Filter to only include timestamps from the last hour
  const now = Date.now();
  const recentAdditions = userAdditions.filter(
    timestamp => now - timestamp < 60 * 60 * 1000
  );

  // Check if user has reached the limit
  if (recentAdditions.length >= 3) {
    // Calculate time until next available slot
    const oldestTimestamp = Math.min(...recentAdditions);
    const resetTime = oldestTimestamp + 60 * 60 * 1000;
    const timeRemaining = resetTime - now;
    
    return res.status(429).json({
      error: 'Rate limit exceeded',
      message: 'You can add another song in ' + Math.ceil(timeRemaining / 60000) + ' minutes',
      songsAdded: recentAdditions.length,
      resetTime
    });
  }

  // Add current timestamp to user's additions
  recentAdditions.push(now);
  songAdditionStore.set(userId, recentAdditions);
  
  // Add rate limit info to the response
  res.locals.rateLimit = {
    songsAdded: recentAdditions.length,
    remaining: 3 - recentAdditions.length,
    resetTime: now + 60 * 60 * 1000
  };

  next();
};

module.exports = {
  songAdditionRateLimit
};
