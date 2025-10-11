// src/components/auth/ProtectedRoute.jsx
// Improved version with better loading states and debugging

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Shield, Loader2 } from 'lucide-react';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  console.log('🛡️ ProtectedRoute check:', { 
    isAuthenticated, 
    isLoading, 
    hasUser: !!user,
    path: location.pathname 
  });

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4 animate-pulse">
            <Shield className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="flex items-center justify-center space-x-2 text-blue-600 dark:text-blue-400 mb-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span className="text-lg font-medium">Checking authentication...</span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Please wait while we verify your credentials
          </p>
        </div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    console.log('❌ Not authenticated, redirecting to login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // User is authenticated, render the protected content
  console.log('✅ Authenticated, rendering protected content');
  return children;
};

export default ProtectedRoute;