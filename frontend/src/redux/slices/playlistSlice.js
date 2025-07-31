import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://127.0.0.1:5000/api';

// Async thunks for playlist management
export const getUserPlaylists = createAsyncThunk(
  'playlist/getUserPlaylists',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/playlists`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to get user playlists');
    }
  }
);

export const getPlaylistDetails = createAsyncThunk(
  'playlist/getPlaylistDetails',
  async (playlistId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/playlists/${playlistId}`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to get playlist details');
    }
  }
);

export const getPlaylistTracks = createAsyncThunk(
  'playlist/getPlaylistTracks',
  async (playlistId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/playlists/${playlistId}/tracks`, {
        withCredentials: true,
      });
      return { playlistId, tracks: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to get playlist tracks');
    }
  }
);

export const createPlaylist = createAsyncThunk(
  'playlist/createPlaylist',
  async ({ name, description }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/playlists`,
        { name, description },
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to create playlist');
    }
  }
);

export const setMainPlaylist = createAsyncThunk(
  'playlist/setMainPlaylist',
  async (playlistId, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${API_URL}/playlists/main`,
        { playlistId },
        { withCredentials: true }
      );
      return { ...response.data, playlistId };
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to set main playlist');
    }
  }
);

export const getMainPlaylist = createAsyncThunk(
  'playlist/getMainPlaylist',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/playlists/main/info`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to get main playlist');
    }
  }
);

export const addTracksToMainPlaylist = createAsyncThunk(
  'playlist/addTracksToMain',
  async (trackUris, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/playlists/main/tracks`,
        { trackUris },
        { withCredentials: true }
      );
      return { ...response.data, trackUris };
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to add tracks to main playlist');
    }
  }
);

export const removeTracksFromMainPlaylist = createAsyncThunk(
  'playlist/removeTracksFromMain',
  async (tracks, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${API_URL}/playlists/main/tracks`,
        { 
          data: { tracks },
          withCredentials: true 
        }
      );
      return { ...response.data, tracks };
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to remove tracks from main playlist');
    }
  }
);

export const reorderTracksInMainPlaylist = createAsyncThunk(
  'playlist/reorderTracksInMain',
  async ({ rangeStart, insertBefore }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${API_URL}/playlists/main/tracks/reorder`,
        { rangeStart, insertBefore },
        { withCredentials: true }
      );
      return { ...response.data, rangeStart, insertBefore };
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to reorder tracks in main playlist');
    }
  }
);

const initialState = {
  userPlaylists: [],
  mainPlaylist: null,
  currentPlaylistDetails: null,
  currentPlaylistTracks: [],
  loading: false,
  error: null,
};

const playlistSlice = createSlice({
  name: 'playlist',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentPlaylist: (state) => {
      state.currentPlaylistDetails = null;
      state.currentPlaylistTracks = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Get User Playlists
      .addCase(getUserPlaylists.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserPlaylists.fulfilled, (state, action) => {
        state.loading = false;
        state.userPlaylists = action.payload;
        state.error = null;
      })
      .addCase(getUserPlaylists.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Get Playlist Details
      .addCase(getPlaylistDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPlaylistDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPlaylistDetails = action.payload;
        state.error = null;
      })
      .addCase(getPlaylistDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Get Playlist Tracks
      .addCase(getPlaylistTracks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPlaylistTracks.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPlaylistTracks = action.payload.tracks;
        state.error = null;
      })
      .addCase(getPlaylistTracks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Create Playlist
      .addCase(createPlaylist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPlaylist.fulfilled, (state, action) => {
        state.loading = false;
        state.userPlaylists = [...state.userPlaylists, action.payload];
        state.mainPlaylist = action.payload;
        state.error = null;
      })
      .addCase(createPlaylist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Set Main Playlist
      .addCase(setMainPlaylist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(setMainPlaylist.fulfilled, (state, action) => {
        state.loading = false;
        state.mainPlaylist = state.userPlaylists.find(
          (playlist) => playlist.id === action.payload.playlistId
        );
        state.error = null;
      })
      .addCase(setMainPlaylist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Get Main Playlist
      .addCase(getMainPlaylist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMainPlaylist.fulfilled, (state, action) => {
        state.loading = false;
        state.mainPlaylist = action.payload;
        state.error = null;
      })
      .addCase(getMainPlaylist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Add Tracks to Main Playlist
      .addCase(addTracksToMainPlaylist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addTracksToMainPlaylist.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(addTracksToMainPlaylist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Remove Tracks from Main Playlist
      .addCase(removeTracksFromMainPlaylist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeTracksFromMainPlaylist.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(removeTracksFromMainPlaylist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Reorder Tracks in Main Playlist
      .addCase(reorderTracksInMainPlaylist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(reorderTracksInMainPlaylist.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(reorderTracksInMainPlaylist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearCurrentPlaylist } = playlistSlice.actions;
export default playlistSlice.reducer;
