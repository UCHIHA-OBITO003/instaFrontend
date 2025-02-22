import React, { useState, useEffect, createContext } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, IconButton } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

export const ThemeContext = createContext();

const ThemeToggle = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');

  useEffect(() => {
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
    },
  });

  return (
    <ThemeContext.Provider value={{ darkMode, setDarkMode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
        <IconButton
          onClick={() => setDarkMode(!darkMode)}
          sx={{ position: 'fixed', bottom: 16, right: 16 }}
        >
          {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeToggle;
