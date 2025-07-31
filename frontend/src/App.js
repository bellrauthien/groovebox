import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store';
import AppMain from './pages/App';
import Login from './pages/Login';
import GuestLogin from './pages/GuestLogin';
import GlobalStyles from './styles/GlobalStyles';

// Auth guard component
const ProtectedRoute = ({ children }) => {
  // Check if user is authenticated using Redux store
  const isAuthenticated = store.getState().auth.isAuthenticated;
  
  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

function App() {
  return (
    <Provider store={store}>
      <GlobalStyles />
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/guest" element={<GuestLogin />} />
          <Route path="/auth-success" element={<Login />} />
          <Route path="/auth-error" element={<Login />} />
          <Route path="/logout" element={<Navigate to="/login" replace />} />
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <AppMain />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
