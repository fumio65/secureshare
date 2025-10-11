// src/context/ThemeContext.jsx
// Fixed version with proper theme persistence

import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  // Initialize theme from localStorage or system preference
  const [theme, setTheme] = useState(() => {
    console.log('🎨 ThemeProvider: Initializing theme...');
    
    // Check localStorage first
    const savedTheme = localStorage.getItem('theme');
    console.log('💾 Saved theme from localStorage:', savedTheme);
    
    if (savedTheme === 'dark' || savedTheme === 'light') {
      console.log('✅ Using saved theme:', savedTheme);
      return savedTheme;
    }
    
    // Check system preference
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const systemTheme = systemPrefersDark ? 'dark' : 'light';
    console.log('🖥️  Using system preference:', systemTheme);
    
    return systemTheme;
  });

  // Apply theme to DOM whenever it changes
  useEffect(() => {
    console.log('🎨 Applying theme to DOM:', theme);
    const root = window.document.documentElement;
    
    // Remove both classes first
    root.classList.remove('light', 'dark');
    
    // Add the current theme class
    root.classList.add(theme);
    
    // Save to localStorage
    localStorage.setItem('theme', theme);
    console.log('💾 Theme saved to localStorage:', theme);
  }, [theme]);

  // Apply theme immediately on mount (before first render)
  useEffect(() => {
    console.log('⚡ Initial theme application on mount');
    const root = window.document.documentElement;
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme === 'dark' || savedTheme === 'light') {
      root.classList.remove('light', 'dark');
      root.classList.add(savedTheme);
      console.log('✅ Applied saved theme immediately:', savedTheme);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    console.log('🔄 Toggling theme from', theme, 'to', newTheme);
    setTheme(newTheme);
  };

  const setDarkMode = () => {
    console.log('🌙 Setting dark mode');
    setTheme('dark');
  };

  const setLightMode = () => {
    console.log('☀️ Setting light mode');
    setTheme('light');
  };

  const value = {
    theme,
    toggleTheme,
    setDarkMode,
    setLightMode,
    isDark: theme === 'dark',
    isLight: theme === 'light',
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};