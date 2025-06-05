import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from 'react';
import PropTypes from 'prop-types';
import { createTheme } from '@mui/material/styles';
import { grey } from '@mui/material/colors';

const THEME_STORAGE_KEY = 'appThemeMode_v3';

const ThemeContext = createContext(null);

export function useThemeContext() {
  return useContext(ThemeContext);
}

export function AppThemeProvider({ children }) {
  const getInitialMode = () => {
    try {
      const storedMode = localStorage.getItem(THEME_STORAGE_KEY);
      return storedMode === 'dark' ? 'dark' : 'light';
    } catch (error) {
      console.error(
        'Tidak dapat mengakses localStorage untuk mode tema:',
        error
      );
      return 'light';
    }
  };

  const [mode, setMode] = useState(getInitialMode);

  useEffect(() => {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, mode);
      document.documentElement.setAttribute('data-theme', mode);
    } catch (error) {
      console.error('Tidak dapat menyimpan mode tema ke localStorage:', error);
    }
  }, [mode]);

  const toggleThemeMode = useCallback(() => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  }, []);

  const muiTheme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...(mode === 'light'
            ? {
                primary: { main: '#1976d2', contrastText: '#ffffff' },
                secondary: { main: '#4caf50', contrastText: '#ffffff' },
                background: { default: grey[100], paper: '#ffffff' },
                text: { primary: grey[900], secondary: grey[700] },
                divider: grey[300],
                action: {
                  active: grey[600],
                  hover: 'rgba(0, 0, 0, 0.04)',
                  selected: 'rgba(0, 0, 0, 0.08)',
                  disabled: 'rgba(0, 0, 0, 0.26)',
                  disabledBackground: 'rgba(0, 0, 0, 0.12)',
                },
              }
            : {
                primary: { main: grey[900], contrastText: '#ffffff' },
                secondary: {
                  main: '#81c784',
                  contrastText: 'rgba(0, 0, 0, 0.87)',
                },
                background: {
                  default: '#121212',
                  paper: '#2d2d2d',
                },
                text: { primary: '#e8e8e8', secondary: grey[500] },
                divider: grey[700],
                action: {
                  active: '#ffffff',
                  hover: 'rgba(255, 255, 255, 0.08)',
                  selected: 'rgba(255, 255, 255, 0.16)',
                  disabled: 'rgba(255, 255, 255, 0.3)',
                  disabledBackground: 'rgba(255, 255, 255, 0.12)',
                },
              }),
        },
        typography: {
          fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        },
        components: {
          MuiPaper: {
            styleOverrides: {
              root: ({ theme }) => ({
                backgroundColor: theme.palette.background.paper,
                color: theme.palette.text.primary,
              }),
            },
            defaultProps: {
              elevation: mode === 'dark' ? 2 : 1,
            },
          },
          MuiCard: {
            styleOverrides: {
              root: ({ theme }) => ({
                backgroundColor: theme.palette.background.paper,
                color: theme.palette.text.primary,
              }),
            },
            defaultProps: {
              elevation: mode === 'dark' ? 3 : 2,
            },
          },
          MuiTextField: {
            styleOverrides: {
              root: ({ theme }) => ({
                '& .MuiOutlinedInput-root': {
                  backgroundColor: theme.palette.background.paper,
                  color: theme.palette.text.primary,
                  '& fieldset': {
                    borderColor: theme.palette.divider,
                  },
                  '&:hover fieldset': {
                    borderColor: theme.palette.primary.main,
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: theme.palette.primary.main,
                  },
                  '& .MuiInputBase-input': {
                    color: theme.palette.text.primary,
                    '&::placeholder': {
                      color: theme.palette.text.secondary,
                      opacity: 0.8,
                    },
                  },
                },
                '& label.Mui-focused': {
                  color: theme.palette.primary.main,
                },
                '& label': {
                  color: theme.palette.text.secondary,
                },
              }),
            },
          },
          MuiButton: {
            styleOverrides: {
              text: ({ theme }) => ({
                color: theme.palette.text.primary,
              }),
            },
          },
          MuiAppBar: {
            defaultProps: {
              elevation: 1,
            },
          },
        },
      }),
    [mode]
  );

  const contextValue = useMemo(
    () => ({
      mode,
      toggleThemeMode,
      muiTheme,
    }),
    [mode, muiTheme, toggleThemeMode]
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

AppThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
