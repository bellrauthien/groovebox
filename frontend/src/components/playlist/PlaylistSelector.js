import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  getUserPlaylists, 
  setMainPlaylist, 
  createPlaylist 
} from '../../redux/slices/playlistSlice';
import { getBestImage } from '../../utils/spotifyHelpers';
import {
  Grid,
  GridItem,
  ActionButton,
  InputField,
  ModalOverlay,
  ModalContent,
  CloseButton,
  LoadingSpinner
} from '../../styles/StyledComponents';

const PlaylistSelector = ({ isAdmin }) => {
  const dispatch = useDispatch();
  const { userPlaylists, mainPlaylist, loading, error } = useSelector(
    (state) => state.playlist
  );
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [newPlaylistDescription, setNewPlaylistDescription] = useState('');

  // Fetch user playlists on component mount
  useEffect(() => {
    dispatch(getUserPlaylists());
  }, [dispatch]);

  // Handle selecting a playlist as the main jukebox playlist
  const handleSelectPlaylist = (playlistId) => {
    if (isAdmin) {
      dispatch(setMainPlaylist(playlistId));
    }
  };

  // Handle creating a new playlist
  const handleCreatePlaylist = (e) => {
    e.preventDefault();
    
    if (isAdmin && newPlaylistName.trim()) {
      dispatch(createPlaylist({
        name: newPlaylistName.trim(),
        description: newPlaylistDescription.trim() || 'GrooveBox Jukebox Playlist'
      }));
      
      // Reset form and close modal
      setNewPlaylistName('');
      setNewPlaylistDescription('');
      setShowCreateModal(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
        <h3>Playlists</h3>
        {isAdmin && (
          <ActionButton 
            onClick={() => setShowCreateModal(true)}
            style={{ fontSize: '0.9rem', padding: '5px 10px' }}
          >
            Create New
          </ActionButton>
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
      ) : userPlaylists.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <p>No playlists found</p>
          {isAdmin && (
            <p style={{ fontSize: '0.9rem', marginTop: '10px' }}>
              Create a new playlist to use as your jukebox playlist
            </p>
          )}
        </div>
      ) : (
        <Grid>
          {userPlaylists.map((playlist) => (
            <GridItem 
              key={playlist.id}
              onClick={() => handleSelectPlaylist(playlist.id)}
              style={{
                border: mainPlaylist?.id === playlist.id ? '2px solid var(--color-gold)' : 'none',
                cursor: isAdmin ? 'pointer' : 'default'
              }}
            >
              <div style={{ width: '100%', aspectRatio: '1', marginBottom: '10px' }}>
                <img 
                  src={getBestImage(playlist, 'medium') || '/assets/default-playlist.png'} 
                  alt={playlist.name} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }}
                />
              </div>
              <div style={{ fontWeight: 'bold', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {playlist.name}
              </div>
              <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>
                {playlist.tracks?.total || 0} tracks
              </div>
              {mainPlaylist?.id === playlist.id && (
                <div style={{ 
                  fontSize: '0.8rem', 
                  color: 'var(--color-gold)', 
                  marginTop: '5px',
                  fontWeight: 'bold'
                }}>
                  Current Jukebox
                </div>
              )}
            </GridItem>
          ))}
        </Grid>
      )}

      {/* Create Playlist Modal */}
      {showCreateModal && (
        <ModalOverlay>
          <ModalContent>
            <CloseButton onClick={() => setShowCreateModal(false)}>×</CloseButton>
            <h3>Create New Playlist</h3>
            
            <form onSubmit={handleCreatePlaylist}>
              <div style={{ marginBottom: '15px' }}>
                <label htmlFor="playlist-name" style={{ display: 'block', marginBottom: '5px' }}>
                  Playlist Name*
                </label>
                <InputField
                  id="playlist-name"
                  type="text"
                  value={newPlaylistName}
                  onChange={(e) => setNewPlaylistName(e.target.value)}
                  placeholder="Enter playlist name"
                  required
                  style={{ width: '100%' }}
                />
              </div>
              
              <div style={{ marginBottom: '20px' }}>
                <label htmlFor="playlist-description" style={{ display: 'block', marginBottom: '5px' }}>
                  Description (optional)
                </label>
                <InputField
                  id="playlist-description"
                  as="textarea"
                  value={newPlaylistDescription}
                  onChange={(e) => setNewPlaylistDescription(e.target.value)}
                  placeholder="Enter playlist description"
                  style={{ width: '100%', height: '80px', resize: 'vertical' }}
                />
              </div>
              
              <ActionButton type="submit" disabled={!newPlaylistName.trim() || loading}>
                {loading ? <LoadingSpinner /> : 'Create Playlist'}
              </ActionButton>
            </form>
          </ModalContent>
        </ModalOverlay>
      )}
    </div>
  );
};

export default PlaylistSelector;
