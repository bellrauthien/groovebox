import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  playTrack,
  pausePlayback,
  skipToNext,
  skipToPrevious,
  setVolume
} from '../../redux/slices/playbackSlice';
import {
  ControlPanel,
  ControlButton,
  VolumeKnob
} from '../../styles/StyledComponents';

const PlaybackControls = ({ isAdmin }) => {
  const dispatch = useDispatch();
  const { isPlaying, volumePercent, loading } = useSelector((state) => state.playback);
  const { mainPlaylist } = useSelector((state) => state.playlist);

  // Handle play/pause
  const handlePlayPause = () => {
    if (!isAdmin) return;
    
    if (isPlaying) {
      dispatch(pausePlayback());
    } else {
      // If we have a main playlist, play it
      if (mainPlaylist) {
        dispatch(playTrack({ context_uri: mainPlaylist.uri }));
      } else {
        dispatch(playTrack({}));
      }
    }
  };

  // Handle skip to next track
  const handleNext = () => {
    if (!isAdmin) return;
    dispatch(skipToNext());
  };

  // Handle skip to previous track
  const handlePrevious = () => {
    if (!isAdmin) return;
    dispatch(skipToPrevious());
  };

  // Handle volume change
  const handleVolumeChange = (newVolume) => {
    if (!isAdmin) return;
    dispatch(setVolume(newVolume));
  };

  // Calculate rotation for volume knob (0-270 degrees)
  const volumeRotation = (volumePercent / 100) * 270;

  return (
    <ControlPanel>
      {/* Previous button */}
      <ControlButton 
        onClick={handlePrevious}
        disabled={!isAdmin || loading}
        title={isAdmin ? "Previous Track" : "Admin only"}
      >
        <i className="fas fa-step-backward"></i>
      </ControlButton>
      
      {/* Play/Pause button */}
      <ControlButton 
        onClick={handlePlayPause}
        disabled={!isAdmin || loading}
        className={isPlaying ? 'active' : ''}
        title={isAdmin ? (isPlaying ? "Pause" : "Play") : "Admin only"}
      >
        <i className={`fas ${isPlaying ? 'fa-pause' : 'fa-play'}`}></i>
      </ControlButton>
      
      {/* Next button */}
      <ControlButton 
        onClick={handleNext}
        disabled={!isAdmin || loading}
        title={isAdmin ? "Next Track" : "Admin only"}
      >
        <i className="fas fa-step-forward"></i>
      </ControlButton>
      
      {/* Volume knob */}
      <div style={{ marginLeft: '20px', textAlign: 'center' }}>
        <VolumeKnob 
          rotation={volumeRotation}
          onClick={(e) => {
            if (!isAdmin) return;
            
            // Calculate volume based on click position
            const rect = e.currentTarget.getBoundingClientRect();
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const clickX = e.clientX - rect.left;
            const clickY = e.clientY - rect.top;
            
            // Calculate angle from center to click point
            let angle = Math.atan2(clickY - centerY, clickX - centerX) * (180 / Math.PI);
            
            // Adjust angle to 0-270 degree range for volume
            angle = (angle + 90) % 360;
            if (angle < 0) angle += 360;
            if (angle > 270) angle = 270;
            
            // Convert angle to volume percentage
            const newVolume = Math.round((angle / 270) * 100);
            handleVolumeChange(newVolume);
          }}
          title={isAdmin ? `Volume: ${volumePercent}%` : "Admin only"}
        />
        <div style={{ marginTop: '5px', fontSize: '0.8rem' }}>Volume</div>
      </div>
    </ControlPanel>
  );
};

export default PlaybackControls;
