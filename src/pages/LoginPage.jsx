import React from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Link from '@mui/material/Link';
import CircularProgress from '@mui/material/CircularProgress';

import useInput from '../hooks/useInput';
import { useAuth } from '../contexts/AuthContext';
import { useLocale } from '../contexts/LocaleContext';
import Swal from 'sweetalert2';

function LoginPage() {
  const [email, onEmailChange, setEmail] = useInput('');
  const [password, onPasswordChange, setPassword] = useInput('');
  const [isLoading, setIsLoading] = React.useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const { translate } = useLocale();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    const { error, message } = await login({ email, password });
    setIsLoading(false);

    if (!error) {
      Swal.fire({
        icon: 'success',
        title: translate('loginSuccessTitle'),
        showConfirmButton: false,
        timer: 1500,
      });
      navigate('/');
      setEmail('');
      setPassword('');
    } else {
      Swal.fire({
        icon: 'error',
        title: translate('loginFailTitle'),
        text: message || translate('loginFail', { message: '' }),
      });
    }
  };

  return (
    <Container
      component="main"
      maxWidth="xs"
      sx={{ mt: { xs: 4, sm: 8 }, mb: 4 }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: { xs: 2, sm: 4 },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5" gutterBottom>
          {translate('loginTitle')}
        </Typography>
        <Stack
          component="form"
          onSubmit={handleSubmit}
          spacing={2}
          sx={{ width: '100%', mt: 1 }}
        >
          <TextField
            required
            fullWidth
            autoFocus
            id="email"
            label={translate('emailLabel')}
            name="email"
            autoComplete="email"
            type="email"
            value={email}
            onChange={onEmailChange}
            disabled={isLoading}
          />
          <TextField
            required
            fullWidth
            name="password"
            label={translate('passwordLabel')}
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={onPasswordChange}
            disabled={isLoading}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={isLoading}
          >
            {isLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              translate('loginButton')
            )}
          </Button>
          <Typography variant="body2" align="center">
            {translate('noAccount')}{' '}
            <Link component={RouterLink} to="/register" variant="body2">
              {translate('registerHere')}
            </Link>
          </Typography>
        </Stack>
      </Paper>
    </Container>
  );
}

export default LoginPage;
