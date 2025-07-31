import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { checkAuthStatus, setAuthSuccess } from '../redux/slices/authSlice';
import AdminLogin from '../components/auth/AdminLogin';
import SpotifyLogin from '../components/auth/SpotifyLogin';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin } = useSelector((state) => state.auth);
  const [adminLoginComplete, setAdminLoginComplete] = useState(false);

  // Check if user is already authenticated
  useEffect(() => {
    dispatch(checkAuthStatus());
  }, [dispatch]);

  // Check for successful Spotify authentication callback
  useEffect(() => {
    const handleAuthCallback = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const state = urlParams.get('state');
      
      if (code && state) {
        // The backend will handle the token exchange
        // We just need to check auth status after redirect
        dispatch(checkAuthStatus())
          .then((resultAction) => {
            if (resultAction.payload?.isAuthenticated) {
              dispatch(setAuthSuccess());
              navigate('/');
            }
          });
      }
    };
    
    // Check if we're on the auth success page
    if (window.location.pathname === '/auth-success') {
      handleAuthCallback();
    }
  }, [dispatch, navigate]);

  // Redirect to main app if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  // Handle admin login completion
  useEffect(() => {
    if (isAdmin && !adminLoginComplete) {
      setAdminLoginComplete(true);
    }
  }, [isAdmin, adminLoginComplete]);

  return (
    adminLoginComplete ? <SpotifyLogin isAdmin={true} /> : <AdminLogin />
  );
};

export default Login;
