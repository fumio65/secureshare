// src/context/AuthContext.jsx
// Updated with getAccessToken function for file uploads

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState(null);

  const clearAuthError = useCallback(() => {
    setAuthError(null);
  }, []);

  const updateAuthState = useCallback((userData, authenticated) => {
    console.log('🔄 Updating auth state:', { authenticated, user: userData?.email });
    setUser(userData);
    setIsAuthenticated(authenticated);
    if (authenticated) {
      setAuthError(null);
    }
  }, []);

  const checkAuthStatus = useCallback(async () => {
    console.log('🔍 Checking auth status...');
    setIsLoading(true);
    
    try {
      // First, check if we have tokens in localStorage
      const hasTokens = authService.isAuthenticated();
      console.log('🔑 Has valid tokens:', hasTokens);
      
      if (!hasTokens) {
        console.log('❌ No valid tokens found, user not authenticated');
        updateAuthState(null, false);
        authService.clearTokens();
        setIsLoading(false);
        return;
      }

      // Try to get the user profile
      console.log('📡 Fetching user profile...');
      const profile = await authService.getProfile();
      console.log('✅ Profile fetched successfully:', profile.email);
      updateAuthState(profile, true);
      
    } catch (error) {
      console.error('❌ Auth check failed:', error.message);
      
      // If the error is due to expired tokens, try to refresh
      if (error.message.includes('401') || error.message.includes('expired')) {
        console.log('🔄 Attempting token refresh...');
        try {
          await authService.refreshTokenIfNeeded();
          console.log('✅ Token refreshed, retrying profile fetch...');
          const profile = await authService.getProfile();
          console.log('✅ Profile fetched after refresh:', profile.email);
          updateAuthState(profile, true);
        } catch (refreshError) {
          console.error('❌ Token refresh failed:', refreshError.message);
          updateAuthState(null, false);
          authService.clearTokens();
          setAuthError('Your session has expired. Please log in again.');
        }
      } else {
        // For other errors, clear auth state
        console.error('❌ Clearing auth state due to error');
        updateAuthState(null, false);
        authService.clearTokens();
      }
    } finally {
      setIsLoading(false);
    }
  }, [updateAuthState]);

  // Set up automatic token refresh
  useEffect(() => {
    if (isAuthenticated) {
      const setupTokenRefresh = () => {
        const expirationTime = authService.getTokenExpirationTime();
        if (expirationTime) {
          const refreshTime = expirationTime - Date.now() - 5 * 60 * 1000;
          
          if (refreshTime > 0) {
            console.log(`⏰ Token will refresh in ${Math.round(refreshTime / 1000 / 60)} minutes`);
            const timeoutId = setTimeout(async () => {
              try {
                console.log('🔄 Auto-refreshing token...');
                await authService.refreshTokenIfNeeded();
                console.log('✅ Token auto-refresh successful');
                setupTokenRefresh();
              } catch (error) {
                console.error('❌ Automatic token refresh failed:', error);
                await logout();
              }
            }, refreshTime);

            return () => clearTimeout(timeoutId);
          }
        }
      };

      const cleanup = setupTokenRefresh();
      return cleanup;
    }
  }, [isAuthenticated]);

  // Check auth status on mount
  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  const login = async (credentials) => {
    setIsLoading(true);
    clearAuthError();
    
    try {
      console.log('🔐 Logging in...');
      const data = await authService.login(credentials);
      console.log('✅ Login successful:', data.user?.email);
      updateAuthState(data.user, true);
      return data;
    } catch (error) {
      console.error('❌ Login failed:', error.message);
      setAuthError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData) => {
    setIsLoading(true);
    clearAuthError();
    
    try {
      console.log('📝 Registering user...');
      const data = await authService.register(userData);
      
      if (data.access && data.refresh && data.user) {
        console.log('✅ Registration successful with auto-login:', data.user.email);
        updateAuthState(data.user, true);
      }
      
      return data;
    } catch (error) {
      console.error('❌ Registration failed:', error.message);
      setAuthError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    
    try {
      console.log('🚪 Logging out...');
      await authService.logout();
      console.log('✅ Logout successful');
    } catch (error) {
      console.error('❌ Logout error:', error);
    } finally {
      updateAuthState(null, false);
      setIsLoading(false);
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const updatedProfile = await authService.updateProfile(profileData);
      setUser(updatedProfile);
      return updatedProfile;
    } catch (error) {
      throw error;
    }
  };

  const changePassword = async (passwordData) => {
    try {
      console.log('🔐 AuthContext: Starting password change...');
      const result = await authService.changePassword(passwordData);
      console.log('✅ AuthContext: Password change successful!', result);
      return result;
    } catch (error) {
      console.error('❌ AuthContext: Password change failed:', error);
      throw error;
    }
  };

  // 🆕 NEW: Get access token for API calls
  const getAccessToken = useCallback(() => {
    const token = authService.getAccessToken();
    console.log('🔑 Getting access token:', token ? '✅ Found' : '❌ Not found');
    return token;
  }, []);

  const value = {
    user,
    isAuthenticated,
    isLoading,
    authError,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    getAccessToken, // 🆕 NEW: Added to context value
    checkAuthStatus,
    clearAuthError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};