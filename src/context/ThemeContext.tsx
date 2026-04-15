'use client';

import { createContext, useContext, useEffect, ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const theme: Theme = 'light';

  useEffect(() => {
    // Explicitly set light theme attribute
    document.documentElement.setAttribute('data-theme', 'light');
    localStorage.setItem('petrolia-theme', 'light');
  }, []);

  // Theme toggle is disabled — locked to light mode
  const toggleTheme = () => { /* intentionally disabled */ };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
