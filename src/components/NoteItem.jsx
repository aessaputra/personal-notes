import React from 'react';
import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
import parser from 'html-react-parser';
import CardMUI from '@mui/material/Card'; // Menggunakan alias untuk Card dari MUI
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

import DeleteIcon from '@mui/icons-material/Delete';
import ArchiveIcon from '@mui/icons-material/Archive';
import UnarchiveIcon from '@mui/icons-material/Unarchive';

import Swal from 'sweetalert2';

// Impor motion dari Framer Motion
import { motion } from 'framer-motion';

const formatDate = (dateString) => {
  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  return new Date(dateString).toLocaleDateString('id-ID', options);
};

// Varian animasi untuk item
const noteItemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
    },
  },
  exit: {
    // Animasi saat item dihapus
    opacity: 0,
    x: -50, // Efek keluar ke samping kiri
    transition: {
      duration: 0.3,
    },
  },
};

// Ubah CardMUI menjadi komponen motion
const MotionCard = motion(CardMUI);

function NoteItem({ note, onDelete, onArchive, onUnarchive }) {
  const { id, title, createdAt, body, archived } = note;
  const bodyPreview = body.length > 150 ? `${body.substring(0, 147)}...` : body;

  const handleDeleteClick = () => {
    Swal.fire({
      title: 'Apakah Anda yakin?',
      text: 'Catatan yang dihapus tidak dapat dikembalikan!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal',
    }).then((result) => {
      if (result.isConfirmed) {
        onDelete(id, archived);
        Swal.fire('Dihapus!', 'Catatan Anda telah dihapus.', 'success');
      }
    });
  };

  return (
    // MotionCard akan mengambil lebar penuh dari parentnya di NoteList
    // sx={{ display: 'flex', flexDirection: 'column', height: '100%' }} tidak lagi terlalu relevan untuk tinggi
    // karena tidak ada item lain di sampingnya dalam satu baris grid.
    // Namun, flexDirection: 'column' tetap berguna untuk struktur internal Card.
    <MotionCard
      variants={noteItemVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      layout // Untuk animasi layout jika diperlukan (misalnya jika ada filter/sort)
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%' /* Memastikan Card mengambil lebar penuh */,
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h5" component="div" gutterBottom>
          <Link component={RouterLink} to={`/notes/${id}`} underline="hover">
            {title}
          </Link>
        </Typography>
        <Typography
          variant="caption"
          color="text.secondary"
          display="block"
          gutterBottom
        >
          {formatDate(createdAt)}
        </Typography>
        <Typography variant="body2" color="text.secondary" component="div">
          {parser(bodyPreview)}
        </Typography>
      </CardContent>
      <CardActions
        sx={{
          marginTop: 'auto',
          paddingLeft: 1,
          paddingRight: 1,
          paddingBottom: 1,
          justifyContent: 'flex-end',
        }}
      >
        <Tooltip title="Hapus">
          <IconButton
            aria-label="Hapus catatan"
            color="error"
            onClick={handleDeleteClick}
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
        {onArchive && (
          <Tooltip title="Arsipkan">
            <IconButton
              aria-label="Arsipkan catatan"
              color="secondary"
              onClick={() => onArchive(id)}
            >
              <ArchiveIcon />
            </IconButton>
          </Tooltip>
        )}
        {onUnarchive && (
          <Tooltip title="Aktifkan dari arsip">
            <IconButton
              aria-label="Aktifkan catatan dari arsip"
              color="primary"
              onClick={() => onUnarchive(id)}
            >
              <UnarchiveIcon />
            </IconButton>
          </Tooltip>
        )}
      </CardActions>
    </MotionCard>
  );
}

NoteItem.propTypes = {
  note: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    body: PropTypes.string.isRequired,
    archived: PropTypes.bool.isRequired,
  }).isRequired,
  onDelete: PropTypes.func.isRequired,
  onArchive: PropTypes.func,
  onUnarchive: PropTypes.func,
};

export default NoteItem;
