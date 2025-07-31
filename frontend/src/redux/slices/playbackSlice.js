import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://127.0.0.1:5000/api';

// Async thunks for playback control
export const getCurrentPlayback = createAsyncThunk(
  'playback/getCurrent',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/playback/current`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to get current playback');
    }
  }
);

export const playTrack = createAsyncThunk(
  'playback/play',
  async (playOptions, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${API_URL}/playback/play`,
        playOptions,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to play track');
    }
  }
);

export const pausePlayback = createAsyncThunk(
  'playback/pause',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${API_URL}/playback/pause`,
        {},
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to pause playback');
    }
  }
);

export const skipToNext = createAsyncThunk(
  'playback/next',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/playback/next`,
        {},
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to skip to next track');
    }
  }
);

export const skipToPrevious = createAsyncThunk(
  'playback/previous',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/playback/previous`,
        {},
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to skip to previous track');
    }
  }
);

export const setVolume = createAsyncThunk(
  'playback/volume',
  async (volumePercent, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${API_URL}/playback/volume`,
        { volume_percent: volumePercent },
        { withCredentials: true }
      );
      return { success: response.data.success, volumePercent };
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to set volume');
    }
  }
);

export const getAvailableDevices = createAsyncThunk(
  'playback/devices',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/admin/devices`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to get available devices');
    }
  }
);

export const setActiveDevice = createAsyncThunk(
  'playback/setDevice',
  async (deviceId, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${API_URL}/admin/device`,
        { deviceId },
        { withCredentials: true }
      );
      return { ...response.data, deviceId };
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to set active device');
    }
  }
);

const initialState = {
  currentTrack: null,
  isPlaying: false,
  progressMs: 0,
  durationMs: 0,
  volumePercent: 50,
  devices: [],
  activeDeviceId: null,
  loading: false,
  error: null,
};

const playbackSlice = createSlice({
  name: 'playback',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    updateProgress: (state, action) => {
      state.progressMs = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Current Playback
      .addCase(getCurrentPlayback.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCurrentPlayback.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.currentTrack = action.payload.item;
          state.isPlaying = action.payload.is_playing;
          state.progressMs = action.payload.progress_ms;
          state.durationMs = action.payload.item?.duration_ms || 0;
          state.volumePercent = action.payload.device?.volume_percent || state.volumePercent;
          state.activeDeviceId = action.payload.device?.id || state.activeDeviceId;
        }
        state.error = null;
      })
      .addCase(getCurrentPlayback.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Play Track
      .addCase(playTrack.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(playTrack.fulfilled, (state) => {
        state.loading = false;
        state.isPlaying = true;
        state.error = null;
      })
      .addCase(playTrack.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Pause Playback
      .addCase(pausePlayback.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(pausePlayback.fulfilled, (state) => {
        state.loading = false;
        state.isPlaying = false;
        state.error = null;
      })
      .addCase(pausePlayback.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Skip to Next
      .addCase(skipToNext.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(skipToNext.fulfilled, (state) => {
        state.loading = false;
        state.progressMs = 0;
        state.error = null;
      })
      .addCase(skipToNext.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Skip to Previous
      .addCase(skipToPrevious.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(skipToPrevious.fulfilled, (state) => {
        state.loading = false;
        state.progressMs = 0;
        state.error = null;
      })
      .addCase(skipToPrevious.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Set Volume
      .addCase(setVolume.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(setVolume.fulfilled, (state, action) => {
        state.loading = false;
        state.volumePercent = action.payload.volumePercent;
        state.error = null;
      })
      .addCase(setVolume.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Get Available Devices
      .addCase(getAvailableDevices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAvailableDevices.fulfilled, (state, action) => {
        state.loading = false;
        state.devices = action.payload;
        state.error = null;
      })
      .addCase(getAvailableDevices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Set Active Device
      .addCase(setActiveDevice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(setActiveDevice.fulfilled, (state, action) => {
        state.loading = false;
        state.activeDeviceId = action.payload.deviceId;
        state.error = null;
      })
      .addCase(setActiveDevice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, updateProgress } = playbackSlice.actions;
export default playbackSlice.reducer;
