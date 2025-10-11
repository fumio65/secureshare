// src/components/layout/Header.jsx
// Enhanced with debugging to track auth state

import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ThemeToggle from '../theme/ThemeToggle';
import CustomButton from '../forms/CustomButton';
import { Shield, LogOut, User } from 'lucide-react';

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  // Debug: Log when auth state changes
  useEffect(() => {
    console.log('🎯 Header: Auth state changed', { 
      isAuthenticated, 
      user: user?.email,
      timestamp: new Date().toISOString()
    });
  }, [isAuthenticated, user]);

  const handleLogout = async () => {
    console.log('🚪 Header: Logout button clicked');
    await logout();
    console.log('🚪 Header: Logout complete, navigating to home');
    navigate('/');
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              SecureShare
            </span>
          </Link>

          {/* Navigation */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-300">
                  <User className="h-4 w-4" />
                  <span>Welcome, {user?.first_name || 'User'}</span>
                </div>
                
                <CustomButton
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="flex items-center space-x-1"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </CustomButton>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login">
                  <CustomButton variant="outline" size="sm">
                    Sign In
                  </CustomButton>
                </Link>
                <Link to="/register">
                  <CustomButton variant="primary" size="sm">
                    Sign Up
                  </CustomButton>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;