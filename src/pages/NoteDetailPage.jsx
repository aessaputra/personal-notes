import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useParams, useNavigate } from 'react-router-dom';
import parser from 'html-react-parser';
import { getNote } from '../utils/local-data';
import NotFoundPage from './NotFoundPage';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';

// Impor ikon
import DeleteIcon from '@mui/icons-material/Delete';
import ArchiveIcon from '@mui/icons-material/Archive';
import UnarchiveIcon from '@mui/icons-material/Unarchive';

// Impor SweetAlert2
import Swal from 'sweetalert2';
// Opsional: Impor CSS SweetAlert2 jika tidak otomatis termuat (biasanya sudah)
// import 'sweetalert2/dist/sweetalert2.min.css';

const formatDate = (dateString) => {
  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  return new Date(dateString).toLocaleDateString('id-ID', options);
};

function NoteDetailPage({ onDelete, onArchive, onUnarchive }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const fetchedNote = getNote(id);
    setNote(fetchedNote);
    setIsLoading(false);
  }, [id]);

  const handleDelete = () => {
    Swal.fire({
      title: 'Apakah Anda yakin?',
      text: 'Catatan yang dihapus tidak dapat dikembalikan!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33', // Warna merah untuk tombol konfirmasi (hapus)
      cancelButtonColor: '#3085d6', // Warna biru untuk tombol batal
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal',
    }).then((result) => {
      if (result.isConfirmed) {
        onDelete(note.id, note.archived);
        Swal.fire('Dihapus!', 'Catatan Anda telah dihapus.', 'success');
        navigate(note.archived ? '/archived' : '/');
      }
    });
  };

  const handleArchiveToggle = () => {
    if (note.archived) {
      onUnarchive(note.id);
    } else {
      onArchive(note.id);
    }
    const updatedNote = getNote(id);
    setNote(updatedNote);
  };

  if (isLoading) {
    return (
      <Typography
        className="loading-indicator"
        sx={{ textAlign: 'center', padding: 5 }}
      >
        Memuat catatan...
      </Typography>
    );
  }

  if (!note) {
    return <NotFoundPage />;
  }

  return (
    <Paper elevation={3} sx={{ padding: 3, margin: 'auto' }}>
      <Typography variant="h4" component="h2" gutterBottom>
        {note.title}
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        {formatDate(note.createdAt)}
      </Typography>
      <Typography component="div" sx={{ mt: 2, mb: 3, lineHeight: 1.8 }}>
        {parser(note.body)}
      </Typography>
      <Stack direction="row" spacing={2}>
        <Button
          variant="contained"
          color="error"
          startIcon={<DeleteIcon />}
          onClick={handleDelete}
        >
          Hapus
        </Button>
        <Button
          variant="outlined"
          color="primary"
          startIcon={note.archived ? <UnarchiveIcon /> : <ArchiveIcon />}
          onClick={handleArchiveToggle}
        >
          {note.archived ? 'Aktifkan' : 'Arsipkan'}
        </Button>
      </Stack>
    </Paper>
  );
}

NoteDetailPage.propTypes = {
  onDelete: PropTypes.func.isRequired,
  onArchive: PropTypes.func.isRequired,
  onUnarchive: PropTypes.func.isRequired,
};

export default NoteDetailPage;
