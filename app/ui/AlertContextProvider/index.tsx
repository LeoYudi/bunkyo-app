'use client'

import { Snackbar, Alert, AlertColor, SnackbarCloseReason } from '@mui/material';
import { createContext, useContext, useState, ReactNode, SyntheticEvent } from 'react';

interface AlertContextType {
  showNotification: (message: string, severity?: AlertColor) => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const AlertContextProvider = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState<AlertColor>('info');

  const showNotification = (msg: string, sev: AlertColor = 'info') => {
    console.log('Showing notification:', msg, 'with severity:', sev);
    setMessage(msg);
    setSeverity(sev);
    setOpen(true);
  };

  const handleClose = (event?: SyntheticEvent | Event, reason?: SnackbarCloseReason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  return (
    <AlertContext.Provider value={{ showNotification }}>
      {children}
      <Snackbar
        open={open}
        autoHideDuration={5000}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        onClose={handleClose}
      >
        <Alert severity={severity} variant="filled" onClose={handleClose}>
          {message}
        </Alert>
      </Snackbar>
    </AlertContext.Provider>
  );
};

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within a AlertContextProvider');
  }
  return context;
};