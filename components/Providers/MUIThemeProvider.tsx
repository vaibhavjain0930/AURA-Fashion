"use client";

import React, { useMemo } from 'react';
import { createTheme, ThemeProvider, useMediaQuery } from '@mui/material';

export default function MUIThemeProvider({ children }: { children: React.ReactNode }) {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? 'dark' : 'light',
          primary: prefersDarkMode 
            ? { main: '#fcfcfd', light: '#ffffff', dark: '#e0e0e0', contrastText: '#090a0f' }
            : { main: '#0f1115', light: '#333538', dark: '#000000', contrastText: '#fafafa' },
          background: prefersDarkMode
            ? { default: '#090a0f', paper: '#111218' }
            : { default: '#fafafa', paper: '#ffffff' },
          text: prefersDarkMode
            ? { primary: '#fcfcfd', secondary: '#8a8d98' }
            : { primary: '#0f1115', secondary: '#5e616b' },
        },
        typography: {
          fontFamily: 'var(--font-sans)',
        },
        shape: { borderRadius: 12 },
        components: {
            MuiPaper: {
                styleOverrides: {
                    root: {
                        backgroundImage: 'none', // Disable MUI elevation overlay in dark mode to match luxury flat theme
                    }
                }
            }
        }
      }),
    [prefersDarkMode],
  );

  return (
    <ThemeProvider theme={theme}>
      {children}
    </ThemeProvider>
  );
}
