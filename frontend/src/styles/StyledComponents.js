import styled, { css, keyframes } from 'styled-components';

// Keyframe animations
const glow = keyframes`
  0% {
    box-shadow: 0 0 5px rgba(230, 57, 70, 0.5);
  }
  50% {
    box-shadow: 0 0 20px rgba(230, 57, 70, 0.8);
  }
  100% {
    box-shadow: 0 0 5px rgba(230, 57, 70, 0.5);
  }
`;

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
`;

// Main container for the jukebox
export const JukeboxContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: linear-gradient(145deg, var(--color-wood), var(--color-wood-dark));
  border-radius: var(--border-radius-lg);
  border: 8px solid var(--color-chrome);
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  position: relative;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 60px;
    background: linear-gradient(90deg, var(--color-chrome-shadow), var(--color-chrome), var(--color-chrome-shadow));
    border-bottom: 4px solid var(--color-chrome-border);
    z-index: 1;
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 20px;
    background: var(--color-chrome-shadow);
    border-top: 2px solid var(--color-chrome-border);
  }
  
  @media (min-width: 768px) {
    flex-direction: row;
    height: 100vh;
    max-height: 800px;
  }
`;

// Chrome-styled elements
export const ChromeElement = css`
  background: linear-gradient(145deg, var(--color-chrome-highlight), var(--color-chrome));
  border-radius: var(--border-radius-md);
  border: 2px solid var(--color-chrome-border);
  box-shadow: var(--shadow-outset), inset 0 0 10px rgba(255, 255, 255, 0.5);
  padding: var(--spacing-md);
`;

// Vintage button styles
export const VintageButton = styled.button`
  ${ChromeElement}
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-display);
  font-size: 1.2rem;
  color: var(--color-black);
  padding: var(--spacing-sm) var(--spacing-md);
  transition: all var(--transition-fast);
  border: 2px solid var(--color-chrome-shadow);
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  }
  
  &:active:not(:disabled) {
    transform: translateY(1px);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

// Red action button
export const ActionButton = styled(VintageButton)`
  background: linear-gradient(145deg, var(--color-red), var(--color-red-dark));
  color: white;
  border: 2px solid var(--color-red-dark);
  font-weight: bold;
  font-family: var(--font-display);
  font-size: 1.5rem;
  letter-spacing: 2px;
  text-transform: uppercase;
  padding: var(--spacing-md) var(--spacing-lg);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3), inset 0 0 10px rgba(255, 255, 255, 0.2);
  text-shadow: 0 0 5px rgba(255, 255, 255, 0.5);
  
  &:hover:not(:disabled) {
    animation: ${pulse} 1s infinite;
    box-shadow: 0 5px 15px var(--color-red), inset 0 0 10px rgba(255, 255, 255, 0.4);
  }
  
  &:active:not(:disabled) {
    background: linear-gradient(145deg, var(--color-red-dark), var(--color-red));
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3), inset 0 0 5px rgba(0, 0, 0, 0.5);
  }
`;

// Control button for playback
export const ControlButton = styled(VintageButton)`
  width: 60px;
  height: 60px;
  border-radius: var(--border-radius-circle);
  font-size: 1.5rem;
  margin: 0 var(--spacing-sm);
  
  &.active {
    background: linear-gradient(145deg, var(--color-gold), var(--color-red));
    animation: ${glow} 2s infinite;
  }
`;

// Volume knob
export const VolumeKnob = styled.div`
  ${ChromeElement}
  width: 80px;
  height: 80px;
  border-radius: var(--border-radius-circle);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  cursor: pointer;
  
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 5px;
    height: 40%;
    background-color: var(--color-black);
    transform-origin: bottom center;
    transform: translate(-50%, -100%) rotate(${props => props.rotation || 0}deg);
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 20px;
    height: 20px;
    background-color: var(--color-chrome-shadow);
    border-radius: var(--border-radius-circle);
    transform: translate(-50%, -50%);
  }
`;

// Album cover display
export const AlbumCover = styled.div`
  width: 100%;
  aspect-ratio: 1;
  max-width: 300px;
  margin: 0 auto;
  border-radius: var(--border-radius-md);
  overflow: hidden;
  box-shadow: var(--shadow-outset);
  position: relative;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform var(--transition-medium);
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 50%);
    pointer-events: none;
  }
  
  ${props => props.spinning && css`
    img {
      animation: ${rotate} 20s linear infinite;
    }
  `}
`;

// Track info display
export const TrackInfoDisplay = styled.div`
  ${ChromeElement}
  background-color: var(--color-black);
  color: var(--color-gold);
  font-family: var(--font-retro);
  padding: var(--spacing-md);
  margin: var(--spacing-md) 0;
  text-align: center;
  min-height: 100px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  
  h3 {
    color: var(--color-gold);
    font-size: 1.2rem;
    margin-bottom: var(--spacing-xs);
    font-family: var(--font-retro);
  }
  
  p {
    color: var(--color-turquoise);
    font-size: 0.9rem;
    margin-bottom: var(--spacing-xs);
  }
`;

// Progress bar
export const ProgressBarContainer = styled.div`
  width: 100%;
  height: 20px;
  background-color: var(--color-black);
  border-radius: var(--border-radius-md);
  margin: var(--spacing-md) 0;
  position: relative;
  overflow: hidden;
  box-shadow: var(--shadow-inset);
`;

export const ProgressBarFill = styled.div`
  height: 100%;
  background: linear-gradient(90deg, var(--color-red) 0%, var(--color-gold) 100%);
  width: ${props => props.progress || 0}%;
  transition: width 0.3s linear;
  border-radius: var(--border-radius-md);
`;

// Song list container
export const SongListContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: var(--spacing-md);
  background-color: var(--color-wood-dark);
  border-radius: var(--border-radius-md);
  margin: var(--spacing-md) 0;
  box-shadow: var(--shadow-inset);
`;

// Song list item
export const SongListItem = styled.div`
  display: flex;
  align-items: center;
  padding: var(--spacing-md);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  transition: background-color var(--transition-fast);
  cursor: pointer;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.05);
  }
  
  ${props => props.active && css`
    background-color: rgba(230, 57, 70, 0.2);
    
    &:hover {
      background-color: rgba(230, 57, 70, 0.3);
    }
  `}
`;

// Search input
export const SearchInput = styled.input`
  ${ChromeElement}
  width: 100%;
  padding: var(--spacing-md);
  font-family: var(--font-primary);
  font-size: 1rem;
  border: none;
  outline: none;
  color: var(--color-black);
  margin-bottom: var(--spacing-md);
  
  &:focus {
    box-shadow: 0 0 0 2px var(--color-gold);
  }
`;

// Main content area
export const MainContent = styled.main`
  flex: 1;
  padding: var(--spacing-md);
  display: flex;
  flex-direction: column;
  overflow-y: auto;
`;

// Sidebar
export const Sidebar = styled.aside`
  width: 100%;
  background-color: var(--color-wood-dark);
  padding: var(--spacing-md);
  
  @media (min-width: 768px) {
    width: 300px;
    height: 100%;
    overflow-y: auto;
  }
`;

// Control panel
export const ControlPanel = styled.div`
  ${ChromeElement}
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  padding: var(--spacing-md);
  margin: var(--spacing-md) 0;
`;

// Logo
export const Logo = styled.div`
  font-family: var(--font-display);
  font-size: 3rem;
  color: var(--color-gold);
  text-align: center;
  margin: var(--spacing-md) 0;
  text-shadow: 
    0 0 5px var(--color-gold),
    0 0 10px var(--color-gold),
    2px 2px 4px rgba(0, 0, 0, 0.8);
  letter-spacing: 2px;
  position: relative;
  z-index: 2;
  
  span {
    color: var(--color-red);
    text-shadow: 
      0 0 5px var(--color-red),
      0 0 10px var(--color-red),
      2px 2px 4px rgba(0, 0, 0, 0.8);
  }
  
  &::before {
    content: '';
    position: absolute;
    top: -10px;
    left: -10px;
    right: -10px;
    bottom: -10px;
    background: radial-gradient(circle, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0) 70%);
    z-index: -1;
  }
`;

// Auth form
export const AuthForm = styled.form`
  ${ChromeElement}
  max-width: 400px;
  margin: 0 auto;
  padding: var(--spacing-lg);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  background: linear-gradient(145deg, #333333, #222222);
  border: 4px solid var(--color-chrome);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.5), inset 0 0 15px rgba(0, 0, 0, 0.5);
  
  h2 {
    color: var(--color-blue);
    font-family: var(--font-display);
    font-size: 2rem;
    text-align: center;
    text-shadow: 0 0 5px var(--color-blue), 0 0 10px var(--color-blue);
    margin-bottom: var(--spacing-lg);
    letter-spacing: 2px;
  }
  
  p {
    color: var(--color-cream);
    text-align: center;
    margin-bottom: var(--spacing-lg);
    font-size: 1rem;
  }
`;

// Input field
export const InputField = styled.input`
  padding: var(--spacing-md);
  font-family: var(--font-retro);
  font-size: 1.2rem;
  border: 3px solid var(--color-chrome-shadow);
  border-radius: var(--border-radius-md);
  outline: none;
  background-color: var(--color-black);
  color: var(--color-neon-green);
  text-align: center;
  letter-spacing: 4px;
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.8);
  
  &:focus {
    border-color: var(--color-gold);
    box-shadow: 0 0 10px var(--color-gold), inset 0 0 10px rgba(0, 0, 0, 0.8);
  }
  
  &::placeholder {
    color: var(--color-chrome-shadow);
    opacity: 0.5;
  }
`;

// Loading spinner
export const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: var(--color-red);
  animation: ${rotate} 1s linear infinite;
  margin: 0 auto;
`;

// Modal
export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

export const ModalContent = styled.div`
  ${ChromeElement}
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
`;

export const CloseButton = styled.button`
  position: absolute;
  top: var(--spacing-sm);
  right: var(--spacing-sm);
  font-size: 1.5rem;
  background: none;
  border: none;
  color: var(--color-black);
  cursor: pointer;
  
  &:hover {
    color: var(--color-red);
  }
`;

// Notification
export const NotificationContainer = styled.div`
  position: fixed;
  top: var(--spacing-md);
  right: var(--spacing-md);
  z-index: 1001;
`;

export const Notification = styled.div`
  ${ChromeElement}
  margin-bottom: var(--spacing-md);
  padding: var(--spacing-md);
  min-width: 300px;
  max-width: 400px;
  
  ${props => props.type === 'error' && css`
    background: linear-gradient(145deg, var(--color-red), var(--color-red-dark));
    color: white;
  `}
  
  ${props => props.type === 'success' && css`
    background: linear-gradient(145deg, #4CAF50, #388E3C);
    color: white;
  `}
  
  ${props => props.type === 'info' && css`
    background: linear-gradient(145deg, var(--color-blue), var(--color-blue-dark));
    color: white;
  `}
`;

// Tab navigation
export const TabNav = styled.nav`
  display: flex;
  margin-bottom: var(--spacing-md);
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  
  &::-webkit-scrollbar {
    height: 4px;
  }
`;

export const TabButton = styled.button`
  padding: var(--spacing-md) var(--spacing-lg);
  font-family: var(--font-display);
  font-size: 1.2rem;
  color: var(--color-cream);
  background: none;
  border: none;
  border-bottom: 3px solid transparent;
  white-space: nowrap;
  
  &:hover {
    color: var(--color-gold);
  }
  
  ${props => props.active && css`
    color: var(--color-gold);
    border-bottom-color: var(--color-red);
  `}
`;

// Grid layout
export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: var(--spacing-md);
`;

export const GridItem = styled.div`
  ${ChromeElement}
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  cursor: pointer;
  transition: transform var(--transition-fast);
  
  &:hover {
    transform: translateY(-5px);
  }
`;

// Rate limit indicator
export const RateLimitIndicator = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: var(--spacing-md) 0;
  font-size: 0.9rem;
  
  .count {
    display: flex;
    margin-right: var(--spacing-md);
    
    .dot {
      width: 15px;
      height: 15px;
      border-radius: var(--border-radius-circle);
      margin: 0 3px;
      
      &.active {
        background-color: var(--color-gold);
        box-shadow: 0 0 5px var(--color-gold);
      }
      
      &.inactive {
        background-color: var(--color-chrome-shadow);
      }
    }
  }
  
  .text {
    color: var(--color-cream);
  }
`;

// Divider
export const Divider = styled.hr`
  border: none;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--color-chrome), transparent);
  margin: var(--spacing-md) 0;
`;

// Footer
export const Footer = styled.footer`
  text-align: center;
  padding: var(--spacing-md);
  font-size: 0.8rem;
  color: var(--color-chrome);
  background-color: var(--color-black);
`;

// Export all styled components
export default {
  JukeboxContainer,
  ChromeElement,
  VintageButton,
  ActionButton,
  ControlButton,
  VolumeKnob,
  AlbumCover,
  TrackInfoDisplay,
  ProgressBarContainer,
  ProgressBarFill,
  SongListContainer,
  SongListItem,
  SearchInput,
  MainContent,
  Sidebar,
  ControlPanel,
  Logo,
  AuthForm,
  InputField,
  LoadingSpinner,
  ModalOverlay,
  ModalContent,
  CloseButton,
  NotificationContainer,
  Notification,
  TabNav,
  TabButton,
  Grid,
  GridItem,
  RateLimitIndicator,
  Divider,
  Footer
};
