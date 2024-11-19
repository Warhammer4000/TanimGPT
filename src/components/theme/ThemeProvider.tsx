import React, { createContext, useContext, useEffect } from 'react';
import { useStore } from '../../lib/store';

type Theme = 'dark' | 'light';

const ThemeContext = createContext<{
  theme: Theme;
  setTheme: (theme: Theme) => void;
} | null>(null);

export function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { settings, updateSettings } = useStore();

  const setTheme = (theme: Theme) => {
    updateSettings({ theme });
  };

  useEffect(() => {
    const root = window.document.documentElement;
    
    if (settings.theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
      root.classList.remove('light', 'dark');
      root.classList.add(systemTheme);
    } else {
      root.classList.remove('light', 'dark');
      root.classList.add(settings.theme);
    }
  }, [settings.theme]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = () => {
      if (settings.theme === 'system') {
        const systemTheme = mediaQuery.matches ? 'dark' : 'light';
        document.documentElement.classList.remove('light', 'dark');
        document.documentElement.classList.add(systemTheme);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [settings.theme]);

  return (
    <ThemeContext.Provider value={{ theme: settings.theme as Theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}