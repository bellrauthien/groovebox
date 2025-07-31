# GrooveBox

A Vintage Jukebox Mobile Application with Spotify Integration

## Description

GrooveBox is a mobile-first web application that recreates the functionality and aesthetic of a vintage jukebox, leveraging the Spotify Public API. It allows an administrator to control a playlist and playback, while guests can browse and add songs to the queue.

## Features

### Administrator Features
- Authentication via 6-digit code
- Spotify account integration
- Playlist management (create, select, add/remove/reorder tracks)
- Playback control (play, pause, skip, volume)
- Device selection for playback

### Guest Features
- Spotify account integration
- View the main jukebox playlist
- Search the Spotify catalog
- Add songs to the playback queue (limited to 3 songs per hour)
- View currently playing song and playback progress

## Technologies Used

### Backend
- Node.js with Express.js
- Spotify Web API Node
- Express Rate Limit for guest restrictions
- Express Session for user management
- CORS for secure cross-origin requests
- Dotenv for environment variable management

### Frontend
- React
- Redux Toolkit for state management
- Styled Components for styling
- Axios for API requests
- React Router for navigation

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)
- Spotify Developer Account with registered application

### Environment Setup

1. Clone the repository:
```
git clone https://github.com/yourusername/groovebox.git
cd groovebox
```

2. Install dependencies:
```
npm run install:all
```

3. Create a `.env` file in the backend directory with the following variables:
```
NODE_ENV=development
PORT=5000
CLIENT_URL=http://127.0.0.1:3000
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
REDIRECT_URI=http://127.0.0.1:5000/api/auth/callback
ADMIN_CODE=123456
```

Replace `your_spotify_client_id` and `your_spotify_client_secret` with your Spotify application credentials from the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/).

### Spotify API Setup

1. Create a new application in the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/)
2. Set the Redirect URI to `http://127.0.0.1:5000/api/auth/callback`
3. Copy the Client ID and Client Secret to your `.env` file

## Usage

### Starting the Application

#### Using the Batch Script (Windows)

1. Simply double-click the `start-groovebox.bat` file in the root directory

OR

2. Open Command Prompt and run:
```
start-groovebox.bat
```

#### Using npm (Cross-platform)

1. Start both the backend and frontend with a single command:
```
npm start
```

Both methods will start the backend server on port 5000 and the frontend development server on port 3000.

### Administrator Flow

1. Navigate to `http://127.0.0.1:3000/login`
2. Enter the 6-digit admin code (default: 123456)
3. Connect your Spotify account when prompted
4. Select or create a playlist to use as the main jukebox playlist
5. Control playback using the playback controls

### Guest Flow

1. Navigate to `http://127.0.0.1:3000/guest`
2. Connect your Spotify account when prompted
3. Browse the main jukebox playlist
4. Search for songs and add them to the queue (limited to 3 per hour)

## Testing

To test the application locally:

1. Make sure both the backend and frontend servers are running
2. Open two different browsers or use incognito mode to simulate administrator and guest users
3. Log in as an administrator in one browser and as a guest in the other
4. Test the different features and interactions between the two user roles

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a pull request

## License

This project is licensed under the ISC License.

## Project Structure

```
groovebox/
├── backend/                # Node.js/Express backend
│   ├── middleware/        # Middleware functions
│   │   ├── auth.js        # Authentication middleware
│   │   └── rateLimit.js   # Rate limiting for guests
│   ├── routes/            # API route handlers
│   │   ├── admin.js       # Admin-specific routes
│   │   ├── auth.js        # Authentication routes
│   │   ├── playback.js    # Playback control routes
│   │   ├── playlists.js   # Playlist management routes
│   │   └── search.js      # Search routes
│   ├── utils/             # Utility functions
│   │   └── spotifyApi.js  # Spotify API helpers
│   ├── .env               # Environment variables (not in repo)
│   ├── package.json       # Backend dependencies
│   └── server.js          # Main server file
├── frontend/              # React frontend
│   ├── public/            # Static files
│   │   └── assets/        # Images and other assets
│   ├── src/               # Source code
│   │   ├── components/    # React components
│   │   │   ├── auth/      # Authentication components
│   │   │   ├── playback/  # Playback control components
│   │   │   ├── playlist/  # Playlist components
│   │   │   └── search/    # Search components
│   │   ├── pages/         # Page components
│   │   ├── redux/         # Redux state management
│   │   │   └── slices/    # Redux slices
│   │   ├── services/      # API services
│   │   ├── styles/        # Styled components
│   │   ├── utils/         # Utility functions
│   │   ├── App.js         # Main App component
│   │   └── index.js       # Entry point
│   └── package.json       # Frontend dependencies
├── .gitignore             # Git ignore rules
├── package.json           # Root package.json with scripts
├── README.md              # This file
└── start-groovebox.bat    # Windows startup script
```

## Acknowledgements

- [Spotify Web API](https://developer.spotify.com/documentation/web-api/)
- [Create React App](https://create-react-app.dev/)
- [Express.js](https://expressjs.com/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [Styled Components](https://styled-components.com/)
