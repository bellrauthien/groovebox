import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  getPlaylistTracks, 
  removeTracksFromMainPlaylist, 
  reorderTracksInMainPlaylist 
} from '../../redux/slices/playlistSlice';
import { playTrack } from '../../redux/slices/playbackSlice';
import { addTrackToQueue, trackAddedToQueue } from '../../redux/slices/queueSlice';
import { formatArtistNames, formatDuration } from '../../utils/formatters';
import { getBestImage, isTrackPlaying } from '../../utils/spotifyHelpers';
import {
  SongListContainer,
  SongListItem,
  ActionButton,
  LoadingSpinner
} from '../../styles/StyledComponents';

const PlaylistTracks = ({ isAdmin }) => {
  const dispatch = useDispatch();
  const { mainPlaylist, currentPlaylistTracks, loading, error } = useSelector(
    (state) => state.playlist
  );
  const { currentTrack, isPlaying } = useSelector((state) => state.playback);
  const [draggedTrackIndex, setDraggedTrackIndex] = useState(null);

  // Fetch tracks when main playlist changes
  useEffect(() => {
    if (mainPlaylist?.id) {
      dispatch(getPlaylistTracks(mainPlaylist.id));
    }
  }, [dispatch, mainPlaylist]);

  // Handle playing a track
  const handlePlayTrack = (track) => {
    if (isAdmin) {
      dispatch(playTrack({ 
        context_uri: mainPlaylist.uri,
        offset: { uri: track.uri }
      }));
    }
  };

  // Handle adding a track to the queue
  const handleAddToQueue = (track) => {
    dispatch(addTrackToQueue(track.uri))
      .then((resultAction) => {
        if (!resultAction.error) {
          // If successful, update the UI with the added track
          dispatch(trackAddedToQueue(track));
        }
      });
  };

  // Handle removing a track from the playlist
  const handleRemoveTrack = (track, index) => {
    if (isAdmin) {
      dispatch(removeTracksFromMainPlaylist([
        { uri: track.uri, positions: [index] }
      ])).then(() => {
        // Refresh the playlist tracks after removal
        if (mainPlaylist?.id) {
          dispatch(getPlaylistTracks(mainPlaylist.id));
        }
      });
    }
  };

  // Handle drag start
  const handleDragStart = (index) => {
    if (isAdmin) {
      setDraggedTrackIndex(index);
    }
  };

  // Handle drag over
  const handleDragOver = (e) => {
    if (isAdmin) {
      e.preventDefault();
    }
  };

  // Handle drop
  const handleDrop = (e, dropIndex) => {
    if (isAdmin && draggedTrackIndex !== null && draggedTrackIndex !== dropIndex) {
      e.preventDefault();
      
      // Reorder tracks in the playlist
      dispatch(reorderTracksInMainPlaylist({
        rangeStart: draggedTrackIndex,
        insertBefore: dropIndex > draggedTrackIndex ? dropIndex + 1 : dropIndex
      })).then(() => {
        // Refresh the playlist tracks after reordering
        if (mainPlaylist?.id) {
          dispatch(getPlaylistTracks(mainPlaylist.id));
        }
      });
      
      setDraggedTrackIndex(null);
    }
  };

  if (!mainPlaylist) {
    return (
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <p>No main jukebox playlist selected</p>
        {isAdmin && (
          <p style={{ fontSize: '0.9rem', marginTop: '10px' }}>
            Select or create a playlist to use as your jukebox playlist
          </p>
        )}
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
        <h3>{mainPlaylist.name}</h3>
        {isAdmin && (
          <div style={{ fontSize: '0.8rem', color: 'var(--color-cream)', opacity: 0.7 }}>
            Drag to reorder tracks
          </div>
        )}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <LoadingSpinner />
        </div>
      ) : error ? (
        <div style={{ color: 'var(--color-red)', textAlign: 'center', padding: '20px' }}>
          {error}
        </div>
      ) : currentPlaylistTracks.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <p>No tracks in this playlist</p>
          {isAdmin && (
            <p style={{ fontSize: '0.9rem', marginTop: '10px' }}>
              Add tracks from the search view
            </p>
          )}
        </div>
      ) : (
        <SongListContainer>
          {currentPlaylistTracks.map((item, index) => {
            const track = item.track;
            const isCurrentlyPlaying = isTrackPlaying(currentTrack, track.id);
            
            return (
              <SongListItem 
                key={`${track.id}-${index}`}
                active={isCurrentlyPlaying}
                draggable={isAdmin}
                onDragStart={() => handleDragStart(index)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, index)}
                style={{ 
                  opacity: draggedTrackIndex === index ? 0.5 : 1,
                  cursor: isAdmin ? 'grab' : 'pointer'
                }}
              >
                <div 
                  style={{ width: '40px', height: '40px', marginRight: '10px', cursor: 'pointer' }}
                  onClick={() => handlePlayTrack(track)}
                >
                  <img 
                    src={getBestImage(track.album, 'small')} 
                    alt={track.album?.name || 'Album Cover'} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }}
                  />
                  {isCurrentlyPlaying && (
                    <div style={{ 
                      position: 'absolute', 
                      top: 0, 
                      left: 0, 
                      width: '40px', 
                      height: '40px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      backgroundColor: 'rgba(0,0,0,0.5)',
                      borderRadius: '4px'
                    }}>
                      <i className={`fas ${isPlaying ? 'fa-pause' : 'fa-play'}`} style={{ color: 'white' }}></i>
                    </div>
                  )}
                </div>
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <div style={{ fontWeight: 'bold', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {track.name}
                  </div>
                  <div style={{ fontSize: '0.8rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {formatArtistNames(track.artists)}
                  </div>
                </div>
                <div style={{ fontSize: '0.8rem', marginRight: '10px', opacity: 0.7 }}>
                  {formatDuration(track.duration_ms)}
                </div>
                <div style={{ display: 'flex', gap: '5px' }}>
                  <ActionButton 
                    onClick={() => handleAddToQueue(track)}
                    style={{ fontSize: '0.8rem', padding: '3px 8px' }}
                    title="Add to Queue"
                  >
                    <i className="fas fa-plus"></i>
                  </ActionButton>
                  {isAdmin && (
                    <ActionButton 
                      onClick={() => handleRemoveTrack(track, index)}
                      style={{ fontSize: '0.8rem', padding: '3px 8px' }}
                      title="Remove from Playlist"
                    >
                      <i className="fas fa-trash"></i>
                    </ActionButton>
                  )}
                </div>
              </SongListItem>
            );
          })}
        </SongListContainer>
      )}
    </div>
  );
};

export default PlaylistTracks;
