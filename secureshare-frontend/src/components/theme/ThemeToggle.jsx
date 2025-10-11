// src/components/theme/ThemeToggle.jsx
// Improved theme toggle with better visual feedback

import React, { useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const ThemeToggle = ({ className = '' }) => {
  const { theme, toggleTheme, isDark } = useTheme();

  // Log theme changes for debugging
  useEffect(() => {
    console.log('🎨 ThemeToggle: Current theme is', theme);
  }, [theme]);

  const handleToggle = () => {
    console.log('🔄 ThemeToggle: Button clicked, toggling theme');
    toggleTheme();
  };

  return (
    <button
      onClick={handleToggle}
      className={`
        relative inline-flex items-center justify-center
        w-10 h-10 rounded-full
        bg-gray-200 dark:bg-gray-700
        hover:bg-gray-300 dark:hover:bg-gray-600
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        dark:focus:ring-offset-gray-900
        transition-all duration-200
        ${className}
      `}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      title={`Current: ${theme} mode. Click to switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      <div className="relative w-5 h-5">
        {/* Sun icon (shown in dark mode) */}
        <Sun
          className={`
            absolute inset-0 w-5 h-5 text-yellow-500
            transition-all duration-300 transform
            ${isDark ? 'opacity-0 scale-0 rotate-90' : 'opacity-100 scale-100 rotate-0'}
          `}
        />
        {/* Moon icon (shown in light mode) */}
        <Moon
          className={`
            absolute inset-0 w-5 h-5 text-blue-400
            transition-all duration-300 transform
            ${isDark ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-0 -rotate-90'}
          `}
        />
      </div>
    </button>
  );
};

export default ThemeToggle;