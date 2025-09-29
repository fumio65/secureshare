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
    setUser(userData);
    setIsAuthenticated(authenticated);
    if (authenticated) {
      setAuthError(null);
    }
  }, []);

  const checkAuthStatus = useCallback(async () => {
    setIsLoading(true);
    
    try {
      if (authService.isAuthenticated()) {
        const profile = await authService.getProfile();
        updateAuthState(profile, true);
      } else {
        updateAuthState(null, false);
        authService.clearTokens();
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      
      // If the error is due to expired tokens, try to refresh
      if (error.message.includes('401') || error.message.includes('expired')) {
        try {
          await authService.refreshTokenIfNeeded();
          const profile = await authService.getProfile();
          updateAuthState(profile, true);
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
          updateAuthState(null, false);
          authService.clearTokens();
          setAuthError('Your session has expired. Please log in again.');
        }
      } else {
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
          const refreshTime = expirationTime - Date.now() - 5 * 60 * 1000; // Refresh 5 minutes before expiry
          
          if (refreshTime > 0) {
            const timeoutId = setTimeout(async () => {
              try {
                await authService.refreshTokenIfNeeded();
                setupTokenRefresh(); // Set up next refresh
              } catch (error) {
                console.error('Automatic token refresh failed:', error);
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

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  const login = async (credentials) => {
    setIsLoading(true);
    clearAuthError();
    
    try {
      const data = await authService.login(credentials);
      updateAuthState(data.user, true);
      return data;
    } catch (error) {
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
      const data = await authService.register(userData);
      
      // If registration includes login (tokens returned)
      if (data.access && data.refresh && data.user) {
        updateAuthState(data.user, true);
      }
      
      return data;
    } catch (error) {
      setAuthError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
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
      return await authService.changePassword(passwordData);
    } catch (error) {
      throw error;
    }
  };

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
    checkAuthStatus,
    clearAuthError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};