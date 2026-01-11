import React, { createContext, useContext } from 'react';
import { colors, gradients, shadows, spacing, typography } from '../theme/tokens';

const theme = {
  colors,
  gradients,
  shadows,
  spacing,
  typography,
};

export type Theme = typeof theme;

const ThemeContext = createContext<Theme>(theme);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
