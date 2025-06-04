import React from 'react';
import { NavLink as RouterNavLink } from 'react-router-dom';
import { Stack, Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useLocale } from '../contexts/LocaleContext';

function Navigation() {
  const theme = useTheme();
  const { translate } = useLocale();

  const getNavLinkStyle = (isActive) => ({
    color: isActive
      ? theme.palette.primary.contrastText
      : theme.palette.text.primary,
    backgroundColor: isActive ? theme.palette.primary.main : 'transparent',
    padding: theme.spacing(0.75, 1.5),
    borderRadius: theme.shape.borderRadius,
    textTransform: 'none',
    fontWeight: isActive ? 'bold' : 'normal',
    '&:hover': {
      backgroundColor: isActive
        ? theme.palette.primary.dark
        : theme.palette.action.hover,
    },
    transition: theme.transitions.create(['background-color', 'color'], {
      duration: theme.transitions.duration.short,
    }),
  });

  return (
    <Stack
      direction="row"
      spacing={{ xs: 0.5, sm: 1 }}
      justifyContent="center"
      alignItems="center"
      sx={{ mb: 2, flexWrap: 'wrap' }}
    >
      <Button
        component={RouterNavLink}
        to="/"
        end
        sx={({ isActive }) => getNavLinkStyle(isActive)}
      >
        {translate('activeNotes')}
      </Button>
      <Button
        component={RouterNavLink}
        to="/archived"
        sx={({ isActive }) => getNavLinkStyle(isActive)}
      >
        {translate('archivedNotes')}
      </Button>
      <Button
        component={RouterNavLink}
        to="/notes/new"
        sx={({ isActive }) => getNavLinkStyle(isActive)}
      >
        {translate('addNote')}
      </Button>
    </Stack>
  );
}

export default Navigation;
