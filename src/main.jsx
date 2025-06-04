import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App.jsx';
import { ThemeProvider, createTheme } from '@mui/material/styles'; // Impor
import CssBaseline from '@mui/material/CssBaseline'; // Impor
import './styles/index.css'; // CSS global Anda

// Buat tema kustom jika perlu, atau gunakan tema default
const theme = createTheme({
  // Kustomisasi tema Anda di sini
  // Misalnya:
  // palette: {
  //   primary: {
  //     main: '#4a90e2', // Warna biru dari header Anda
  //   },
  //   secondary: {
  //     main: '#5cb85c', // Warna hijau dari tombol arsip Anda
  //   },
  //   error: {
  //     main: '#ff6b6b', // Warna merah dari tombol hapus Anda
  //   }
  // },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      {' '}
      {/* Bungkus dengan ThemeProvider */}
      <CssBaseline /> {/* Menormalisasi CSS lintas browser */}
      <Router>
        <App />
      </Router>
    </ThemeProvider>
  </React.StrictMode>
);
