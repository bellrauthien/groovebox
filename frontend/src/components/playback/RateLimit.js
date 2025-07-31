import React from 'react';
import { useSelector } from 'react-redux';
import { calculateRateLimitRemaining } from '../../utils/spotifyHelpers';
import { RateLimitIndicator } from '../../styles/StyledComponents';

const RateLimit = () => {
  const { rateLimit } = useSelector((state) => state.queue);
  const { songsAdded = 0, remaining = 3, resetTime } = rateLimit || {};

  // Create an array of dots representing the rate limit
  const dots = Array(3).fill(null).map((_, index) => {
    return index < songsAdded ? 'active' : 'inactive';
  });

  return (
    <RateLimitIndicator>
      <div className="count">
        {dots.map((status, index) => (
          <div key={index} className={`dot ${status}`} />
        ))}
      </div>
      <div className="text">
        {remaining === 0 ? (
          calculateRateLimitRemaining(rateLimit)
        ) : (
          `${remaining} song${remaining !== 1 ? 's' : ''} remaining this hour`
        )}
      </div>
    </RateLimitIndicator>
  );
};

export default RateLimit;
