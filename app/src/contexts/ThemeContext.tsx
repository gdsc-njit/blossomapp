import React, { createContext, useContext, ReactNode } from 'react';

export interface ThemeColors {
  // primary colors
  primary: string;
  primaryDark: string;
  primaryLight: string;

  // secondary colors
  secondary: string;
  secondaryDark: string;
  secondaryLight: string;

  // neutral colors
  background: string;
  surface: string;
  text: string;
  textSecondary: string;

  // status colors
  success: string;
  warning: string;
  error: string;

  // tab bar colors
  tabBarActive: string;
  tabBarInactive: string;
  tabBarBackground: string;
}

const def_theme: ThemeColors = {
  // primary colors - teal
  primary: '#4ECDC4',
  primaryDark: '#45B7AE',
  primaryLight: '#6FD8D0',

  // secondary colors - blue
  secondary: '#4A90E2',
  secondaryDark: '#357ABD',
  secondaryLight: '#7FB3FF',

  // neutral colors - white and gray
  background: '#FFFFFF',
  surface: '#F8F9FA',
  text: '#2D3436',
  textSecondary: '#636E72',

  // status colors
  success: '#00B894',
  warning: '#FDCB6E',
  error: '#E17055',

  // tab colors
  tabBarActive: '#4ECDC4',
  tabBarInactive: '#636E72',
  tabBarBackground: '#FFFFFF',
};

interface ThemeContextType {
  colors: ThemeColors;
  //future could add a way to toggle dark mode or whatever else we want!
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const value: ThemeContextType = {
    colors: def_theme,
  };

  return (
    <ThemeContext.Provider value={value}>
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