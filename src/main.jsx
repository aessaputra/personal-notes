import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App.jsx';

import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import './styles/index.css';

import { AuthProvider } from './contexts/AuthContext';
import { AppThemeProvider, useThemeContext } from './contexts/ThemeContext';
import { LocaleProvider } from './contexts/LocaleContext';

function MuiThemeWrapper({ children }) {
  const { muiTheme } = useThemeContext();
  return (
    <MuiThemeProvider theme={muiTheme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <AppThemeProvider>
        <LocaleProvider>
          <AuthProvider>
            <MuiThemeWrapper>
              <App />
            </MuiThemeWrapper>
          </AuthProvider>
        </LocaleProvider>
      </AppThemeProvider>
    </Router>
  </React.StrictMode>
);
