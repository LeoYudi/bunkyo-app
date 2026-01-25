'use client';

import { createTheme } from '@mui/material/styles';

export const customTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#480d1f',
    },
    secondary: {
      main: '#a8593a',
    },
  },
  typography: {
    h1: {
      fontSize: '4rem',
      fontWeight: 600,
    },
    h2: {
      fontSize: '3.5rem',
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontSize: '2.5rem',
      fontWeight: 600,
    },
    h5: {
      fontSize: '2rem',
      fontWeight: 600,
    },
    h6: {
      fontSize: '1.5rem',
      fontWeight: 600,
    },
    button: {
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
  },
});
