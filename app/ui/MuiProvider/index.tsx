'use client'

import { ReactNode } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';

import { customTheme } from '@/src/utils/customTheme';

export function MuiProvider({ children }: { children: ReactNode }) {
  return (
    <AppRouterCacheProvider>
      <ThemeProvider theme={customTheme}>
        {children}
      </ThemeProvider>
    </AppRouterCacheProvider>
  )
}