import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSpotifyLoginUrl } from '../../redux/slices/authSlice';
import { 
  Logo, 
  LoadingSpinner,
  JukeboxContainer
} from '../../styles/StyledComponents';
import styled from 'styled-components';

const GuestLoginContainer = styled.div`
  padding: 20px;
  max-width: 500px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
`;

const JukeboxHeader = styled.div`
  position: relative;
  margin-bottom: 30px;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -15px;
    left: 50%;
    transform: translateX(-50%);
    width: 80%;
    height: 5px;
    background: linear-gradient(90deg, transparent, var(--color-chrome), transparent);
    border-radius: 5px;
  }
`;

const GuestForm = styled.div`
  background: linear-gradient(145deg, #333333, #222222);
  border: 4px solid var(--color-chrome);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.5), inset 0 0 15px rgba(0, 0, 0, 0.5);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-lg);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
`;

const NeonText = styled.h2`
  color: var(--color-neon-green);
  font-family: var(--font-display);
  font-size: 2.5rem;
  text-align: center;
  text-shadow: 
    0 0 5px var(--color-neon-green),
    0 0 10px var(--color-neon-green),
    0 0 20px var(--color-neon-green);
  margin-bottom: 10px;
  letter-spacing: 3px;
  text-transform: uppercase;
`;

const InstructionText = styled.p`
  color: var(--color-cream);
  text-align: center;
  font-size: 1.1rem;
  margin-bottom: 20px;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.8);
`;

const SpotifyButton = styled.button`
  background: linear-gradient(145deg, #1DB954, #1AA34A);
  color: white;
  border: none;
  border-radius: var(--border-radius-md);
  font-family: var(--font-display);
  font-size: 1.5rem;
  letter-spacing: 2px;
  padding: var(--spacing-md) var(--spacing-lg);
  cursor: pointer;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin: 20px auto;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
  }
  
  &:active {
    transform: translateY(1px);
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  }
  
  &:disabled {
    background: #666;
    cursor: not-allowed;
    transform: none;
  }
`;

const BackButton = styled.button`
  background: none;
  border: none;
  color: var(--color-turquoise);
  font-family: var(--font-display);
  font-size: 1.2rem;
  margin-top: 20px;
  cursor: pointer;
  text-shadow: 
    0 0 5px var(--color-turquoise),
    0 0 10px var(--color-turquoise);
  transition: all 0.3s ease;
  
  &:hover {
    color: var(--color-neon-blue);
    text-shadow: 
      0 0 5px var(--color-neon-blue),
      0 0 10px var(--color-neon-blue),
      0 0 15px var(--color-neon-blue);
    transform: scale(1.05);
  }
`;

const ErrorMessage = styled.div`
  color: var(--color-neon-pink);
  text-align: center;
  font-size: 1rem;
  margin: 10px 0;
  text-shadow: 
    0 0 5px var(--color-neon-pink),
    0 0 10px var(--color-neon-pink);
  animation: pulse 1.5s infinite;
`;

const GuestLogin = () => {
  const dispatch = useDispatch();
  const { spotifyLoginUrl, loading, error } = useSelector((state) => state.auth);
  const [authError, setAuthError] = useState(false);
  
  useEffect(() => {
    // Get Spotify login URL
    dispatch(getSpotifyLoginUrl())
      .unwrap()
      .then(() => {
        setAuthError(false);
      })
      .catch(() => {
        setAuthError(true);
      });
  }, [dispatch]);
  
  const handleSpotifyLogin = () => {
    if (spotifyLoginUrl) {
      window.location.href = spotifyLoginUrl;
    }
  };
  
  return (
    <JukeboxContainer>
      <GuestLoginContainer>
        <JukeboxHeader>
          <Logo>
            <span>Groove</span>Box
          </Logo>
        </JukeboxHeader>
        
        <GuestForm>
          <NeonText>Guest Access</NeonText>
          <InstructionText>
            Connect with Spotify to add songs to the jukebox queue
          </InstructionText>
          
          {authError ? (
            <ErrorMessage>Failed to connect to Spotify. Please try again.</ErrorMessage>
          ) : error ? (
            <ErrorMessage>{error}</ErrorMessage>
          ) : null}
          
          <SpotifyButton 
            onClick={handleSpotifyLogin}
            disabled={loading}
          >
            {loading ? <LoadingSpinner /> : (
              <>
                <i className="fab fa-spotify"></i>
                Connect with Spotify
              </>
            )}
          </SpotifyButton>
          
          <BackButton 
            type="button" 
            onClick={() => window.location.href = '/login'}
          >
            Back to Admin Login
          </BackButton>
        </GuestForm>
      </GuestLoginContainer>
    </JukeboxContainer>
  );
};

export default GuestLogin;
