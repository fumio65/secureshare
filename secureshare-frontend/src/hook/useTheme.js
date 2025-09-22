import { useContext, useEffect, useState } from 'react';
import ThemeContext from '../context/theme';

export const useTheme = () => {
  const context = useContext(ThemeContext);
  
  if (!context) {
    throw new Error(
      'useTheme must be used within a ThemeProvider. ' +
      'Make sure your component is wrapped with <ThemeProvider>.'
    );
  }
  
  return context;
};

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