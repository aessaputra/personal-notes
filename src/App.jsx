import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  Routes,
  Route,
  useSearchParams,
  useNavigate,
  Navigate,
} from 'react-router-dom';
import {
  Box,
  Typography,
  CircularProgress,
  AppBar,
  Toolbar,
  IconButton as MuiIconButton,
  Tooltip as MuiTooltip,
  Container,
  Paper,
} from '@mui/material';

import HomePage from './pages/HomePage';
import ArchivedPage from './pages/ArchivedPage';
import NewNotePage from './pages/NewNotePage';
import NoteDetailPage from './pages/NoteDetailPage';
import NotFoundPage from './pages/NotFoundPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';

import Navigation from './components/Navigation';
import SearchBar from './components/SearchBar';

import { useAuth } from './contexts/AuthContext';
import { useThemeContext } from './contexts/ThemeContext';
import { useLocale } from './contexts/LocaleContext';

import {
  getActiveNotes,
  getArchivedNotes,
  addNote,
  deleteNote,
  archiveNote,
  unarchiveNote,
} from './utils/network-data';

import './styles/App.css';

import LogoutIcon from '@mui/icons-material/Logout';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import TranslateIcon from '@mui/icons-material/Translate';

import Swal from 'sweetalert2';

function ProtectedRoute({ children }) {
  const { authedUser, initializing } = useAuth();
  const { translate } = useLocale();
  if (initializing) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: 'calc(100vh - 120px)',
          width: '100%',
        }}
      >
        <CircularProgress />
        <Typography sx={{ ml: 2, color: 'text.secondary' }}>
          {translate('loadingSession')}
        </Typography>
      </Box>
    );
  }
  if (!authedUser)
    return (
      <Navigate
        to="/login"
        state={{ from: window.location.pathname }}
        replace
      />
    );
  return children;
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

function PublicRoute({ children }) {
  const { authedUser, initializing } = useAuth();
  const { translate } = useLocale();
  if (initializing) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: 'calc(100vh - 120px)',
          width: '100%',
        }}
      >
        <CircularProgress />
        <Typography sx={{ ml: 2, color: 'text.secondary' }}>
          {translate('loadingSession')}
        </Typography>
      </Box>
    );
  }
  if (authedUser) return <Navigate to="/" replace />;
  return children;
}

PublicRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

function App() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { authedUser, initializing, logout } = useAuth();
  const { mode: currentThemeMode, toggleThemeMode } = useThemeContext();
  const { locale, toggleLocale, translate } = useLocale();

  const [activeNotes, setActiveNotes] = useState([]);
  const [archivedNotes, setArchivedNotes] = useState([]);
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get('keyword') || ''
  );
  const [isLoadingNotes, setIsLoadingNotes] = useState(true);

  useEffect(() => {
    setSearchTerm(searchParams.get('keyword') || '');
  }, [searchParams]);

  const fetchAllNotes = useCallback(async () => {
    if (!authedUser) {
      setActiveNotes([]);
      setArchivedNotes([]);
      setIsLoadingNotes(false);
      return;
    }
    setIsLoadingNotes(true);
    try {
      const [activeRes, archivedRes] = await Promise.all([
        getActiveNotes(),
        getArchivedNotes(),
      ]);
      setActiveNotes(activeRes.error ? [] : activeRes.data || []);
      setArchivedNotes(archivedRes.error ? [] : archivedRes.data || []);
      if (activeRes.error)
        console.error(
          translate('fetchActiveNotesFail', { message: activeRes.message })
        );
      if (archivedRes.error)
        console.error(
          translate('fetchArchivedNotesFail', { message: archivedRes.message })
        );
    } catch (error) {
      console.error(translate('fetchAllNotesFail'), error);
      setActiveNotes([]);
      setArchivedNotes([]);
      Swal.fire({
        icon: 'error',
        title: translate('oopsTitle'),
        text: translate('fetchAllNotesFailText'),
      });
    } finally {
      setIsLoadingNotes(false);
    }
  }, [authedUser, translate]);

  useEffect(() => {
    fetchAllNotes();
  }, [fetchAllNotes]);

  const onSearchHandler = (keyword) => {
    setSearchTerm(keyword);
    setSearchParams(keyword ? { keyword } : {});
  };

  const onLogoutHandler = () => {
    logout();
    navigate('/login');
    Swal.fire({
      icon: 'info',
      title: translate('logoutSuccessTitle'),
      text: translate('logoutSuccessText'),
      showConfirmButton: false,
      timer: 1500,
    });
  };

  const onAddNoteHandler = async ({ title, body }) => {
    const { error, message } = await addNote({ title, body });
    if (!error) {
      await fetchAllNotes();
      navigate('/');
      Swal.fire({
        icon: 'success',
        title: translate('addNoteSuccessTitle'),
        text: translate('addNoteSuccessText'),
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: translate('addNoteFailTitle'),
        text: message || translate('addNoteFailText'),
      });
    }
  };

  const onDeleteNoteHandler = async (id, isArchived) => {
    const { error, message } = await deleteNote(id);
    if (!error) {
      await fetchAllNotes();
      if (window.location.pathname.includes(`/notes/${id}`)) {
        navigate(isArchived ? '/archived' : '/');
      }
      Swal.fire({
        icon: 'success',
        title: translate('deleteNoteSuccessTitle'),
        text: translate('deleteNoteSuccessText'),
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: translate('deleteNoteFailTitle'),
        text: message || translate('deleteNoteFailText'),
      });
    }
  };

  const onArchiveNoteHandler = async (id) => {
    const { error, message } = await archiveNote(id);
    if (!error) {
      await fetchAllNotes();
      Swal.fire({
        icon: 'success',
        title: translate('archiveNoteSuccessTitle'),
        text: translate('archiveNoteSuccessText'),
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: translate('archiveNoteFailTitle'),
        text: message || translate('archiveNoteFailText'),
      });
    }
  };

  const onUnarchiveNoteHandler = async (id) => {
    const { error, message } = await unarchiveNote(id);
    if (!error) {
      await fetchAllNotes();
      Swal.fire({
        icon: 'success',
        title: translate('unarchiveNoteSuccessTitle'),
        text: translate('unarchiveNoteSuccessText'),
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: translate('unarchiveNoteFailTitle'),
        text: message || translate('unarchiveNoteFailText'),
      });
    }
  };

  if (initializing) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          bgcolor: 'background.default',
          color: 'text.primary',
        }}
      >
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ ml: 2 }}>
          {translate('loadingSession')}
        </Typography>
      </Box>
    );
  }

  const filteredActiveNotes = activeNotes.filter((note) =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredArchivedNotes = archivedNotes.filter((note) =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box
      className="app-container"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        bgcolor: 'background.default',
      }}
    >
      <AppBar position="sticky" elevation={1} sx={{ bgcolor: 'primary.main' }}>
        <Container maxWidth="lg">
          <Toolbar disableGutters>
            <Typography
              variant="h6"
              component="div"
              sx={{
                flexGrow: 1,
                fontWeight: 'bold',
                cursor: 'pointer',
                color: 'primary.contrastText',
              }}
              onClick={() => navigate('/')}
            >
              {translate('appName')}
            </Typography>
            <MuiTooltip title={translate('languageToggle')}>
              <MuiIconButton
                sx={{ ml: 1, color: 'primary.contrastText' }}
                onClick={toggleLocale}
              >
                <TranslateIcon />
                <Typography
                  variant="caption"
                  sx={{
                    ml: 0.5,
                    textTransform: 'uppercase',
                    display: { xs: 'none', sm: 'inline' },
                  }}
                >
                  {locale}
                </Typography>
              </MuiIconButton>
            </MuiTooltip>
            <MuiTooltip
              title={
                currentThemeMode === 'light'
                  ? translate('themeToggleDark')
                  : translate('themeToggleLight')
              }
            >
              <MuiIconButton
                sx={{ ml: 1, color: 'primary.contrastText' }}
                onClick={toggleThemeMode}
              >
                {currentThemeMode === 'dark' ? (
                  <Brightness7Icon />
                ) : (
                  <Brightness4Icon />
                )}
              </MuiIconButton>
            </MuiTooltip>
            {authedUser && (
              <MuiTooltip title={translate('logout')}>
                <MuiIconButton
                  onClick={onLogoutHandler}
                  sx={{ ml: 1, color: 'primary.contrastText' }}
                >
                  <LogoutIcon />
                </MuiIconButton>
              </MuiTooltip>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      <Container
        maxWidth="lg"
        component="div"
        sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', py: 2 }}
      >
        {authedUser && (
          <Paper
            component="header"
            elevation={2}
            sx={{ p: 2, mb: 3, borderRadius: 2 }}
          >
            <Navigation />
            <SearchBar
              currentSearchTerm={searchTerm}
              onSearch={onSearchHandler}
            />
            <Typography
              variant="caption"
              sx={{
                display: 'block',
                textAlign: 'right',
                mt: 1,
                color: 'text.secondary',
              }}
            >
              {translate('loginAs', { name: authedUser.name })}
            </Typography>
          </Paper>
        )}

        <Paper
          component="main"
          elevation={authedUser ? 2 : 0}
          sx={{
            flexGrow: 1,
            p: { xs: 2, sm: 3 },
            borderRadius: 2,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {authedUser &&
            isLoadingNotes &&
            activeNotes.length === 0 &&
            archivedNotes.length === 0 && (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  my: 5,
                  flexGrow: 1,
                }}
              >
                <CircularProgress />
                <Typography sx={{ ml: 2, color: 'text.secondary' }}>
                  {translate('loadingNotes')}
                </Typography>
              </Box>
            )}
          {!(
            authedUser &&
            isLoadingNotes &&
            activeNotes.length === 0 &&
            archivedNotes.length === 0
          ) && (
            <Routes>
              <Route
                path="/login"
                element={
                  <PublicRoute>
                    <LoginPage />
                  </PublicRoute>
                }
              />
              <Route
                path="/register"
                element={
                  <PublicRoute>
                    <RegisterPage />
                  </PublicRoute>
                }
              />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <HomePage
                      activeNotes={filteredActiveNotes}
                      onDelete={onDeleteNoteHandler}
                      onArchive={onArchiveNoteHandler}
                      isLoading={
                        isLoadingNotes && filteredActiveNotes.length === 0
                      }
                    />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/archived"
                element={
                  <ProtectedRoute>
                    <ArchivedPage
                      archivedNotes={filteredArchivedNotes}
                      onDelete={onDeleteNoteHandler}
                      onUnarchive={onUnarchiveNoteHandler}
                      isLoading={
                        isLoadingNotes && filteredActiveNotes.length === 0
                      }
                    />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/notes/new"
                element={
                  <ProtectedRoute>
                    <NewNotePage onAddNote={onAddNoteHandler} />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/notes/:id"
                element={
                  <ProtectedRoute>
                    <NoteDetailPage
                      onDeleteNoteHandler={onDeleteNoteHandler}
                      onArchiveNoteHandler={onArchiveNoteHandler}
                      onUnarchiveNoteHandler={onUnarchiveNoteHandler}
                    />
                  </ProtectedRoute>
                }
              />
              <Route
                path="*"
                element={
                  authedUser ? (
                    <NotFoundPage />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />
            </Routes>
          )}
        </Paper>
      </Container>

      <Box
        component="footer"
        sx={{ py: 3, mt: 'auto', bgcolor: 'transparent' }}
      >
        <Typography variant="body2" color="text.secondary" align="center">
          {translate('copyright', { year: new Date().getFullYear() })}
        </Typography>
      </Box>
    </Box>
  );
}

export default App;
