import { useEffect, useState } from 'react';
import { useTheme as useThemeFromContext } from '../context/ThemeContext';

// Re-export the centralized useTheme hook
export const useTheme = () => useThemeFromContext();

// Additional hook for listening to theme changes
export const useThemeListener = (callback) => {
  useEffect(() => {
    const handleThemeChange = (event) => {
      if (callback && typeof callback === 'function') {
        callback(event.detail);
      }
    };

    window.addEventListener('themeChanged', handleThemeChange);
    
    return () => {
      window.removeEventListener('themeChanged', handleThemeChange);
    };
  }, [callback]);
};

// Hook for components that need to detect system theme changes
export const useSystemTheme = () => {
  const [systemTheme, setSystemTheme] = useState(() => 
    window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e) => {
      setSystemTheme(e.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handleChange);
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return systemTheme;
};