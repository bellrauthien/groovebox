import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addTrackToQueue, trackAddedToQueue } from '../../redux/slices/queueSlice';
import { addTracksToMainPlaylist } from '../../redux/slices/playlistSlice';
import { formatArtistNames, formatDuration } from '../../utils/formatters';
import { getBestImage } from '../../utils/spotifyHelpers';
import {
  SongListContainer,
  SongListItem,
  ActionButton,
  LoadingSpinner
} from '../../styles/StyledComponents';

const SearchResults = ({ results, isAdmin }) => {
  const dispatch = useDispatch();
  const { loading: queueLoading } = useSelector((state) => state.queue);
  const { mainPlaylist, loading: playlistLoading } = useSelector((state) => state.playlist);
  const { isLoading } = useSelector((state) => state.ui);

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

  // Handle adding a track to the main playlist
  const handleAddToPlaylist = (track) => {
    if (isAdmin && mainPlaylist) {
      dispatch(addTracksToMainPlaylist([track.uri]));
    }
  };

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <LoadingSpinner />
      </div>
    );
  }

  if (!results || !results.tracks || !results.tracks.items || results.tracks.items.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <p>No results found</p>
        <p style={{ fontSize: '0.9rem', marginTop: '10px' }}>
          Try searching for a song, artist, or album
        </p>
      </div>
    );
  }

  return (
    <div>
      <h3>Search Results</h3>
      <SongListContainer>
        {results.tracks.items.map((track) => (
          <SongListItem key={track.id}>
            <div style={{ width: '40px', height: '40px', marginRight: '10px' }}>
              <img 
                src={getBestImage(track.album, 'small')} 
                alt={track.album?.name || 'Album Cover'} 
                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }}
              />
            </div>
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <div style={{ fontWeight: 'bold', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {track.name}
              </div>
              <div style={{ fontSize: '0.8rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {formatArtistNames(track.artists)} • {track.album.name}
              </div>
            </div>
            <div style={{ fontSize: '0.8rem', marginRight: '10px', opacity: 0.7 }}>
              {formatDuration(track.duration_ms)}
            </div>
            <div style={{ display: 'flex', gap: '5px' }}>
              <ActionButton 
                onClick={() => handleAddToQueue(track)}
                disabled={queueLoading}
                style={{ fontSize: '0.8rem', padding: '3px 8px' }}
                title="Add to Queue"
              >
                <i className="fas fa-plus"></i>
              </ActionButton>
              {isAdmin && mainPlaylist && (
                <ActionButton 
                  onClick={() => handleAddToPlaylist(track)}
                  disabled={playlistLoading}
                  style={{ fontSize: '0.8rem', padding: '3px 8px' }}
                  title="Add to Playlist"
                >
                  <i className="fas fa-list"></i>
                </ActionButton>
              )}
            </div>
          </SongListItem>
        ))}
      </SongListContainer>
    </div>
  );
};

export default SearchResults;
