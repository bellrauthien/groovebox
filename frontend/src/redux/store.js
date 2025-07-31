import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import playbackReducer from './slices/playbackSlice';
import playlistReducer from './slices/playlistSlice';
import queueReducer from './slices/queueSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    playback: playbackReducer,
    playlist: playlistReducer,
    queue: queueReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
