import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://127.0.0.1:5000/api';

// Async thunks for queue management
export const addTrackToQueue = createAsyncThunk(
  'queue/addTrack',
  async (uri, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/playback/queue`,
        { uri },
        { withCredentials: true }
      );
      return { ...response.data, uri };
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to add track to queue');
    }
  }
);

export const clearQueue = createAsyncThunk(
  'queue/clear',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${API_URL}/admin/queue`,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to clear queue');
    }
  }
);

const initialState = {
  queuedTracks: [],
  rateLimit: {
    songsAdded: 0,
    remaining: 3,
    resetTime: null
  },
  loading: false,
  error: null,
};

const queueSlice = createSlice({
  name: 'queue',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    // Since Spotify API doesn't provide a way to get the queue,
    // we'll manually track added tracks for UI purposes
    trackAddedToQueue: (state, action) => {
      state.queuedTracks.push(action.payload);
    },
    removeTrackFromQueue: (state, action) => {
      state.queuedTracks = state.queuedTracks.filter(
        track => track.id !== action.payload
      );
    },
    updateQueueAfterPlayback: (state) => {
      if (state.queuedTracks.length > 0) {
        state.queuedTracks.shift();
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Add Track to Queue
      .addCase(addTrackToQueue.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addTrackToQueue.fulfilled, (state, action) => {
        state.loading = false;
        // Update rate limit information if provided
        if (action.payload.rateLimit) {
          state.rateLimit = action.payload.rateLimit;
        }
        state.error = null;
      })
      .addCase(addTrackToQueue.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Clear Queue
      .addCase(clearQueue.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(clearQueue.fulfilled, (state) => {
        state.loading = false;
        state.queuedTracks = [];
        state.error = null;
      })
      .addCase(clearQueue.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { 
  clearError, 
  trackAddedToQueue, 
  removeTrackFromQueue, 
  updateQueueAfterPlayback 
} = queueSlice.actions;

export default queueSlice.reducer;
