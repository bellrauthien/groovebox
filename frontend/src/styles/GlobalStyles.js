import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  :root {
    /* Vintage Jukebox Color Palette */
    --color-chrome: #D7D7D7;
    --color-chrome-highlight: #F5F5F5;
    --color-chrome-shadow: #A0A0A0;
    --color-red: #FF3B3F;
    --color-red-dark: #E71D36;
    --color-blue: #4CC9F0;
    --color-blue-dark: #073B4C;
    --color-cream: #F1FAEE;
    --color-gold: #FFD700;
    --color-turquoise: #40E0D0;
    --color-black: #111111;
    --color-wood: #8B4513;
    --color-wood-dark: #5D2906;
    --color-neon-pink: #FF00FF;
    --color-neon-blue: #00FFFF;
    --color-neon-green: #39FF14;
    --color-burgundy: #800020;
    --color-chrome-border: #888888;
    
    /* Typography */
    --font-primary: 'Poppins', sans-serif;
    --font-display: 'Bebas Neue', cursive;
    --font-retro: 'Press Start 2P', cursive;
    
    /* Spacing */
    --spacing-xs: 0.25rem;
    --spacing-sm: 0.5rem;
    --spacing-md: 1rem;
    --spacing-lg: 1.5rem;
    --spacing-xl: 2rem;
    --spacing-xxl: 3rem;
    
    /* Border Radius */
    --border-radius-sm: 4px;
    --border-radius-md: 8px;
    --border-radius-lg: 16px;
    --border-radius-xl: 24px;
    --border-radius-circle: 50%;
    
    /* Box Shadows */
    --shadow-inset: inset 2px 2px 5px rgba(0, 0, 0, 0.3);
    --shadow-outset: 2px 2px 5px rgba(0, 0, 0, 0.3);
    --shadow-neon: 0 0 10px rgba(230, 57, 70, 0.8);
    
    /* Transitions */
    --transition-fast: 0.2s ease;
    --transition-medium: 0.3s ease;
    --transition-slow: 0.5s ease;
  }
  
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  
  html, body {
    font-family: var(--font-primary);
    background-color: var(--color-black);
    color: var(--color-cream);
    font-size: 16px;
    line-height: 1.5;
    overflow-x: hidden;
    height: 100%;
    width: 100%;
  }
  
  #root {
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  
  h1, h2, h3, h4, h5, h6 {
    font-family: var(--font-display);
    font-weight: 700;
    line-height: 1.2;
    margin-bottom: var(--spacing-md);
    color: var(--color-cream);
  }
  
  h1 {
    font-size: 3rem;
  }
  
  h2 {
    font-size: 2.5rem;
  }
  
  h3 {
    font-size: 2rem;
  }
  
  h4 {
    font-size: 1.5rem;
  }
  
  h5 {
    font-size: 1.25rem;
  }
  
  h6 {
    font-size: 1rem;
  }
  
  p {
    margin-bottom: var(--spacing-md);
  }
  
  a {
    color: var(--color-turquoise);
    text-decoration: none;
    transition: color var(--transition-fast);
    
    &:hover {
      color: var(--color-gold);
    }
  }
  
  button {
    cursor: pointer;
    font-family: var(--font-primary);
    border: none;
    background: none;
    
    &:disabled {
      cursor: not-allowed;
      opacity: 0.7;
    }
  }
  
  ul, ol {
    list-style-position: inside;
    margin-bottom: var(--spacing-md);
  }
  
  img {
    max-width: 100%;
    height: auto;
  }
  
  /* Chrome, Safari, Edge scrollbar styling */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  
  ::-webkit-scrollbar-track {
    background: var(--color-black);
  }
  
  ::-webkit-scrollbar-thumb {
    background: var(--color-blue);
    border-radius: var(--border-radius-md);
  }
  
  ::-webkit-scrollbar-thumb:hover {
    background: var(--color-red);
  }
  
  /* Firefox scrollbar styling */
  * {
    scrollbar-width: thin;
    scrollbar-color: var(--color-blue) var(--color-black);
  }
  
  /* Utility classes */
  .text-center {
    text-align: center;
  }
  
  .text-right {
    text-align: right;
  }
  
  .text-left {
    text-align: left;
  }
  
  .mb-0 {
    margin-bottom: 0;
  }
  
  .mt-0 {
    margin-top: 0;
  }
  
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }
`;

export default GlobalStyles;
