import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getCurrentPlayback, updateProgress } from '../../redux/slices/playbackSlice';
import { formatTime, formatArtistNames } from '../../utils/formatters';
import { getBestImage } from '../../utils/spotifyHelpers';
import {
  AlbumCover,
  TrackInfoDisplay,
  ProgressBarContainer,
  ProgressBarFill
} from '../../styles/StyledComponents';

const NowPlaying = () => {
  const dispatch = useDispatch();
  const { currentTrack, isPlaying, progressMs, durationMs } = useSelector(
    (state) => state.playback
  );
  const [localProgress, setLocalProgress] = useState(progressMs);
  const [progressInterval, setProgressInterval] = useState(null);

  // Update progress from Redux state
  useEffect(() => {
    setLocalProgress(progressMs);
  }, [progressMs]);

  // Handle progress tracking
  useEffect(() => {
    // Clear any existing interval
    if (progressInterval) {
      clearInterval(progressInterval);
    }

    // If playing, update progress every second
    if (isPlaying && currentTrack) {
      const interval = setInterval(() => {
        setLocalProgress((prev) => {
          const newProgress = prev + 1000;
          // If we reach the end of the track, stop updating
          if (newProgress >= durationMs) {
            clearInterval(interval);
            return durationMs;
          }
          return newProgress;
        });
      }, 1000);

      setProgressInterval(interval);
    }

    // Cleanup interval on unmount
    return () => {
      if (progressInterval) {
        clearInterval(progressInterval);
      }
    };
  }, [isPlaying, currentTrack, durationMs, progressMs]);

  // Fetch current playback every 10 seconds
  useEffect(() => {
    const fetchPlayback = () => {
      dispatch(getCurrentPlayback());
    };

    // Initial fetch
    fetchPlayback();

    // Set up interval for periodic updates
    const interval = setInterval(fetchPlayback, 10000);

    return () => clearInterval(interval);
  }, [dispatch]);

  // Calculate progress percentage
  const progressPercentage = durationMs > 0 
    ? (localProgress / durationMs) * 100 
    : 0;

  if (!currentTrack) {
    return (
      <div>
        <AlbumCover>
          <img src="/assets/default-cover.png" alt="No track playing" />
        </AlbumCover>
        <TrackInfoDisplay>
          <h3>No Track Playing</h3>
          <p>Select a track to start playback</p>
        </TrackInfoDisplay>
        <ProgressBarContainer>
          <ProgressBarFill progress={0} />
        </ProgressBarContainer>
      </div>
    );
  }

  return (
    <div>
      <AlbumCover spinning={isPlaying}>
        <img 
          src={getBestImage(currentTrack.album, 'large')} 
          alt={currentTrack.album?.name || 'Album Cover'} 
        />
      </AlbumCover>
      
      <TrackInfoDisplay>
        <h3>{currentTrack.name}</h3>
        <p>{formatArtistNames(currentTrack.artists)}</p>
        <p>{currentTrack.album?.name}</p>
      </TrackInfoDisplay>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
        <span>{formatTime(localProgress)}</span>
        <span>{formatTime(durationMs)}</span>
      </div>
      
      <ProgressBarContainer>
        <ProgressBarFill progress={progressPercentage} />
      </ProgressBarContainer>
    </div>
  );
};

export default NowPlaying;
