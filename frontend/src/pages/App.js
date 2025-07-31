import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { checkAuthStatus } from '../redux/slices/authSlice';
import { getMainPlaylist } from '../redux/slices/playlistSlice';
import NowPlaying from '../components/playback/NowPlaying';
import PlaybackControls from '../components/playback/PlaybackControls';
import Queue from '../components/playback/Queue';
import RateLimit from '../components/playback/RateLimit';
import PlaylistSelector from '../components/playlist/PlaylistSelector';
import PlaylistTracks from '../components/playlist/PlaylistTracks';
import SearchBar from '../components/search/SearchBar';
import SearchResults from '../components/search/SearchResults';
import {
  JukeboxContainer,
  MainContent,
  Sidebar,
  Logo,
  TabNav,
  TabButton,
  ActionButton,
  LoadingSpinner
} from '../styles/StyledComponents';

const App = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, isAdmin, username } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState('main');
  const [searchResults, setSearchResults] = useState(null);
  const { isLoading } = useSelector((state) => state.ui);

  // Check authentication status on mount
  useEffect(() => {
    dispatch(checkAuthStatus());
  }, [dispatch]);

  // Fetch main playlist if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getMainPlaylist());
    }
  }, [dispatch, isAuthenticated]);

  // Handle search results
  const handleSearchResults = (results) => {
    setSearchResults(results);
    setActiveTab('search');
  };

  // Handle logout
  const handleLogout = () => {
    // Redirect to login page
    window.location.href = '/logout';
  };

  if (!isAuthenticated) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <JukeboxContainer>
      <Sidebar>
        <Logo>
          <span>Groove</span>Box
        </Logo>
        
        <div style={{ marginBottom: '20px', textAlign: 'center' }}>
          <p>Welcome, {username || 'User'}</p>
          <p style={{ fontSize: '0.8rem', opacity: 0.7 }}>
            {isAdmin ? 'Administrator' : 'Guest'}
          </p>
          <ActionButton 
            onClick={handleLogout}
            style={{ fontSize: '0.9rem', padding: '5px 10px', marginTop: '10px' }}
          >
            Logout
          </ActionButton>
        </div>
        
        <NowPlaying />
        <PlaybackControls isAdmin={isAdmin} />
        
        {!isAdmin && <RateLimit />}
      </Sidebar>
      
      <MainContent>
        <SearchBar onSearchResults={handleSearchResults} />
        
        <TabNav>
          <TabButton 
            active={activeTab === 'main'} 
            onClick={() => setActiveTab('main')}
          >
            Main Playlist
          </TabButton>
          <TabButton 
            active={activeTab === 'search'} 
            onClick={() => setActiveTab('search')}
          >
            Search
          </TabButton>
          <TabButton 
            active={activeTab === 'queue'} 
            onClick={() => setActiveTab('queue')}
          >
            Queue
          </TabButton>
          {isAdmin && (
            <TabButton 
              active={activeTab === 'playlists'} 
              onClick={() => setActiveTab('playlists')}
            >
              My Playlists
            </TabButton>
          )}
        </TabNav>
        
        {isLoading && (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <LoadingSpinner />
          </div>
        )}
        
        {!isLoading && (
          <>
            {activeTab === 'main' && <PlaylistTracks isAdmin={isAdmin} />}
            {activeTab === 'search' && <SearchResults results={searchResults} isAdmin={isAdmin} />}
            {activeTab === 'queue' && <Queue isAdmin={isAdmin} />}
            {activeTab === 'playlists' && isAdmin && <PlaylistSelector isAdmin={isAdmin} />}
          </>
        )}
      </MainContent>
    </JukeboxContainer>
  );
};

export default App;
