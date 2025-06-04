import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useParams, useNavigate } from 'react-router-dom';
import parser from 'html-react-parser';
import {
  Box,
  Typography,
  Paper,
  Stack,
  Button,
  CircularProgress,
  IconButton,
  Tooltip as MuiTooltip,
  Grid,
} from '@mui/material';

import { getNote } from '../utils/network-data';
import { useLocale } from '../contexts/LocaleContext';

import DeleteIcon from '@mui/icons-material/Delete';
import ArchiveIcon from '@mui/icons-material/Archive';
import UnarchiveIcon from '@mui/icons-material/Unarchive';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import Swal from 'sweetalert2';
import NotFoundPage from './NotFoundPage';

const formatDate = (dateString, locale) => {
  if (!dateString) return '';
  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  return new Date(dateString).toLocaleDateString(
    locale === 'id' ? 'id-ID' : 'en-US',
    options
  );
};

function NoteDetailPage({
  onDeleteNoteHandler,
  onArchiveNoteHandler,
  onUnarchiveNoteHandler,
}) {
  const { id: noteId } = useParams();
  const navigate = useNavigate();
  const { translate, locale } = useLocale();

  const [note, setNote] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);

  useEffect(() => {
    async function fetchNoteDetail() {
      setIsLoading(true);
      const { error, data, message } = await getNote(noteId);
      if (!error && data) {
        setNote(data);
      } else {
        console.error(
          'Gagal mengambil detail catatan:',
          message || 'Catatan tidak ditemukan'
        );
        setNote(null);
      }
      setIsLoading(false);
    }
    if (noteId) {
      fetchNoteDetail();
    } else {
      setIsLoading(false);
      setNote(null);
    }
  }, [noteId]);

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: translate('confirmDeleteTitle'),
      text: translate('confirmDeleteText'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: translate('confirmDeleteButton'),
      cancelButtonText: translate('cancelButton'),
    });

    if (result.isConfirmed) {
      setIsActionLoading(true);
      await onDeleteNoteHandler(noteId, note ? note.archived : false);
      setIsActionLoading(false);
    }
  };

  const handleArchiveToggle = async () => {
    if (!note) return;
    setIsActionLoading(true);
    if (note.archived) {
      await onUnarchiveNoteHandler(noteId);
      setNote((prevNote) =>
        prevNote ? { ...prevNote, archived: false } : null
      );
    } else {
      await onArchiveNoteHandler(noteId);
      setNote((prevNote) =>
        prevNote ? { ...prevNote, archived: true } : null
      );
    }
    setIsActionLoading(false);
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: 'calc(100vh - 250px)',
        }}
      >
        <CircularProgress />
        <Typography sx={{ ml: 2, color: 'text.secondary' }}>
          {translate('loadingNoteDetail')}
        </Typography>
      </Box>
    );
  }

  if (!note) {
    return <NotFoundPage />;
  }

  return (
    <Box sx={{ padding: { xs: 1, sm: 2 } }}>
      <MuiTooltip title={translate('backButtonTooltip')}>
        <IconButton
          onClick={() => navigate(-1)}
          sx={{ mb: 2, color: 'text.secondary' }}
        >
          <ArrowBackIcon />
        </IconButton>
      </MuiTooltip>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{
          fontWeight: 'bold',
          wordBreak: 'break-word',
          color: 'text.primary',
        }}
      >
        {note.title || translate('untitledNote')}
      </Typography>
      <Typography
        variant="subtitle2"
        color="text.secondary"
        gutterBottom
        sx={{ mb: 3 }}
      >
        {translate('noteDetailCreatedOn', {
          date: formatDate(note.createdAt, locale),
        })}
      </Typography>
      <Box
        className="detail-page__body"
        sx={{
          fontSize: '1.1rem',
          lineHeight: 1.7,
          wordBreak: 'break-word',
          mb: 4,
          color: 'text.primary',
          '& p': { marginBlockStart: 0, marginBlockEnd: '1em' },
          '& strong': { fontWeight: 'bold' },
          '& em': { fontStyle: 'italic' },
          '& ul, & ol': { paddingInlineStart: '20px', marginBlockEnd: '1em' },
          '& li': { marginBlockEnd: '0.5em' },
          '& a': { color: 'primary.main', textDecoration: 'underline' },
          '& blockquote': {
            borderInlineStart: (theme) => `4px solid ${theme.palette.divider}`,
            paddingInlineStart: (theme) => theme.spacing(2),
            marginInlineStart: 0,
            marginInlineEnd: 0,
            color: 'text.secondary',
            fontStyle: 'italic',
          },
          '& pre': {
            backgroundColor: (theme) =>
              theme.palette.mode === 'dark'
                ? theme.palette.grey[800]
                : theme.palette.grey[100],
            padding: (theme) => theme.spacing(2),
            borderRadius: (theme) => theme.shape.borderRadius,
            overflowX: 'auto',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-all',
          },
          '& code': {
            fontFamily: 'monospace',
            backgroundColor: (theme) =>
              theme.palette.mode === 'dark'
                ? theme.palette.grey[700]
                : theme.palette.grey[200],
            padding: '0.2em 0.4em',
            borderRadius: '3px',
            fontSize: '0.9em',
          },
          '& pre code': { padding: 0, backgroundColor: 'transparent' },
        }}
      >
        {typeof note.body === 'string' && note.body.trim() !== '' ? (
          parser(note.body)
        ) : (
          <Typography color="text.secondary">
            {translate('noNoteBody')}
          </Typography>
        )}
      </Box>
      <Grid
        container
        spacing={2}
        sx={{
          borderTop: (theme) => `1px solid ${theme.palette.divider}`,
          pt: 3,
          mt: 3,
        }}
      >
        <Grid item xs={12} sm={6} md="auto">
          {' '}
          <Button
            variant="contained"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={handleDelete}
            disabled={isActionLoading}
            fullWidth
          >
            {isActionLoading && note
              ? translate('deletingText')
              : translate('deleteAction')}
          </Button>
        </Grid>
        <Grid item xs={12} sm={6} md="auto">
          <Button
            variant="outlined"
            color={note.archived ? 'primary' : 'secondary'}
            startIcon={note.archived ? <UnarchiveIcon /> : <ArchiveIcon />}
            onClick={handleArchiveToggle}
            disabled={isActionLoading}
            fullWidth
          >
            {isActionLoading
              ? translate('processingText')
              : note.archived
              ? translate('unarchiveAction')
              : translate('archiveAction')}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}

NoteDetailPage.propTypes = {
  onDeleteNoteHandler: PropTypes.func.isRequired,
  onArchiveNoteHandler: PropTypes.func.isRequired,
  onUnarchiveNoteHandler: PropTypes.func.isRequired,
};

export default NoteDetailPage;
