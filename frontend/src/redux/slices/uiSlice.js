import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  theme: 'default',
  sidebarOpen: false,
  activeView: 'main', // 'main', 'search', 'playlist', 'settings'
  notifications: [],
  searchQuery: '',
  searchResults: null,
  isLoading: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload;
    },
    setActiveView: (state, action) => {
      state.activeView = action.payload;
    },
    addNotification: (state, action) => {
      state.notifications.push({
        id: Date.now(),
        ...action.payload,
      });
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        notification => notification.id !== action.payload
      );
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setSearchResults: (state, action) => {
      state.searchResults = action.payload;
    },
    clearSearchResults: (state) => {
      state.searchResults = null;
    },
    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },
});

export const {
  setTheme,
  toggleSidebar,
  setSidebarOpen,
  setActiveView,
  addNotification,
  removeNotification,
  clearNotifications,
  setSearchQuery,
  setSearchResults,
  clearSearchResults,
  setIsLoading,
} = uiSlice.actions;

export default uiSlice.reducer;
