import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

const AuthStatus = ({ className = '' }) => {
  const { isAuthenticated, isLoading, authError, user, clearAuthError } = useAuth();

  if (isLoading) {
    return (
      <div className={`flex items-center space-x-2 text-blue-600 dark:text-blue-400 ${className}`}>
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="text-sm">Checking authentication...</span>
      </div>
    );
  }

  if (authError) {
    return (
      <div className={`bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 ${className}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
            <span className="text-sm text-red-700 dark:text-red-400">{authError}</span>
          </div>
          <button
            onClick={clearAuthError}
            className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
          >
            <span className="sr-only">Dismiss</span>
            ×
          </button>
        </div>
      </div>
    );
  }

  if (isAuthenticated && user) {
    return (
      <div className={`flex items-center space-x-2 text-green-600 dark:text-green-400 ${className}`}>
        <CheckCircle className="h-4 w-4" />
        <span className="text-sm">Signed in as {user.email}</span>
      </div>
    );
  }

  return null;
};

export default AuthStatus;