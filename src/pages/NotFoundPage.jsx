import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';
import { useLocale } from '../contexts/LocaleContext';

function NotFoundPage() {
  const { translate } = useLocale();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        minHeight: '60vh',
        p: 3,
      }}
    >
      <Typography
        variant="h3"
        component="h2"
        gutterBottom
        sx={{ fontWeight: 'bold' }}
      >
        {translate('pageNotFound')}
      </Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        {translate('pageNotFoundMessage')}
      </Typography>
      <Button component={RouterLink} to="/" variant="contained" color="primary">
        {translate('backToHome')}
      </Button>
    </Box>
  );
}

export default NotFoundPage;
