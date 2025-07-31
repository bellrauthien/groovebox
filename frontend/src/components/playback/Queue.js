import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearQueue } from '../../redux/slices/queueSlice';
import { formatArtistNames } from '../../utils/formatters';
import { getBestImage } from '../../utils/spotifyHelpers';
import {
  SongListContainer,
  SongListItem,
  ActionButton
} from '../../styles/StyledComponents';

const Queue = ({ isAdmin }) => {
  const dispatch = useDispatch();
  const { queuedTracks, loading } = useSelector((state) => state.queue);

  const handleClearQueue = () => {
    if (isAdmin) {
      dispatch(clearQueue());
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
        <h3>Queue</h3>
        {isAdmin && (
          <ActionButton 
            onClick={handleClearQueue} 
            disabled={loading || queuedTracks.length === 0}
            style={{ fontSize: '0.9rem', padding: '5px 10px' }}
          >
            Clear Queue
          </ActionButton>
        )}
      </div>

      <SongListContainer>
        {queuedTracks.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <p>No tracks in the queue</p>
            <p style={{ fontSize: '0.9rem', marginTop: '10px' }}>
              {isAdmin 
                ? 'Add tracks to the queue from the search or playlist view'
                : 'Search for songs to add to the queue'}
            </p>
          </div>
        ) : (
          queuedTracks.map((track, index) => (
            <SongListItem key={`${track.id}-${index}`}>
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
                  {formatArtistNames(track.artists)}
                </div>
              </div>
              <div style={{ fontSize: '0.8rem', marginLeft: '10px', opacity: 0.7 }}>
                {index === 0 ? 'Next' : `#${index + 1}`}
              </div>
            </SongListItem>
          ))
        )}
      </SongListContainer>
    </div>
  );
};

export default Queue;
