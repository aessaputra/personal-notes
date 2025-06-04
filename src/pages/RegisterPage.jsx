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

function RegisterPage() {
  const [name, onNameChange, setName] = useInput('');
  const [email, onEmailChange, setEmail] = useInput('');
  const [password, onPasswordChange, setPassword] = useInput('');
  const [confirmPassword, onConfirmPasswordChange, setConfirmPassword] =
    useInput('');
  const [isLoading, setIsLoading] = React.useState(false);
  const navigate = useNavigate();
  const { register } = useAuth(); // Asumsi register dari AuthContext
  const { translate } = useLocale();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: translate('oopsTitle') || 'Oops...',
        text: translate('passwordMismatch'),
      });
      return;
    }
    if (password.length < 6) {
      Swal.fire({
        icon: 'error',
        title: translate('oopsTitle') || 'Oops...',
        text: translate('passwordMinLength'),
      });
      return;
    }

    setIsLoading(true);
    const { error, message } = await register({ name, email, password });
    setIsLoading(false);

    if (!error) {
      Swal.fire({
        icon: 'success',
        title: translate('successTitle'),
        text: translate('registerSuccess'),
      });
      navigate('/login');
      setName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    } else {
      Swal.fire({
        icon: 'error',
        title: translate('registerFailTitle'),
        text: message || translate('registerFail', { message: '' }),
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
          {translate('registerTitle')}
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
            id="name"
            label={translate('nameLabel')}
            name="name"
            autoComplete="name"
            value={name}
            onChange={onNameChange}
            disabled={isLoading}
          />
          <TextField
            required
            fullWidth
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
            autoComplete="new-password"
            value={password}
            onChange={onPasswordChange}
            disabled={isLoading}
          />
          <TextField
            required
            fullWidth
            name="confirmPassword"
            label={translate('confirmPasswordLabel')}
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={onConfirmPasswordChange}
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
              translate('registerButton')
            )}
          </Button>
          <Typography variant="body2" align="center">
            {translate('haveAccount')}{' '}
            <Link component={RouterLink} to="/login" variant="body2">
              {translate('loginHere')}
            </Link>
          </Typography>
        </Stack>
      </Paper>
    </Container>
  );
}

export default RegisterPage;
