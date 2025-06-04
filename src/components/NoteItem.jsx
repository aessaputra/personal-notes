import React from 'react';
import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
import parser from 'html-react-parser';
import CardMUI from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import CircularProgress from '@mui/material/CircularProgress';

import DeleteIcon from '@mui/icons-material/Delete';
import ArchiveIcon from '@mui/icons-material/Archive';
import UnarchiveIcon from '@mui/icons-material/Unarchive';

import Swal from 'sweetalert2';
import { motion } from 'framer-motion';
import { useLocale } from '../contexts/LocaleContext';

const formatDate = (dateString, locale) => {
  if (!dateString) return '';
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(
    locale === 'id' ? 'id-ID' : 'en-US',
    options
  );
};

const noteItemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  exit: { opacity: 0, x: -50, transition: { duration: 0.3 } },
};

const MotionCard = motion(CardMUI);

const notePropTypes = PropTypes.shape({
  id: PropTypes.string.isRequired,
  title: PropTypes.string,
  createdAt: PropTypes.string.isRequired,
  body: PropTypes.string,
  archived: PropTypes.bool.isRequired,
});

function NoteItem({ note, onDelete, onArchive, onUnarchive }) {
  const { id, title, createdAt, body, archived } = note;
  const { translate, locale } = useLocale();

  const bodyPreview =
    typeof body === 'string' && body.length > 100
      ? `${body.substring(0, 97)}...`
      : body;
  const [isProcessing, setIsProcessing] = React.useState(false);

  const handleDeleteClick = async () => {
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
      setIsProcessing(true);
      await onDelete(id, archived);
      setIsProcessing(false);
    }
  };

  const handleArchiveToggle = async () => {
    setIsProcessing(true);
    if (archived && onUnarchive) {
      await onUnarchive(id);
    } else if (!archived && onArchive) {
      await onArchive(id);
    }
    setIsProcessing(false);
  };

  return (
    <MotionCard
      variants={noteItemVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      layout
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        opacity: isProcessing ? 0.7 : 1,
        bgcolor: 'background.paper',
        color: 'text.primary',
        overflow: 'hidden',
      }}
      elevation={2}
    >
      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        <Typography
          variant="h6"
          component="div"
          gutterBottom
          noWrap
          sx={{ fontWeight: 'bold' }}
        >
          <Link
            component={RouterLink}
            to={`/notes/${id}`}
            underline="hover"
            color="inherit"
          >
            {title || translate('untitledNote')}
          </Link>
        </Typography>
        <Typography
          variant="caption"
          color="text.secondary"
          display="block"
          sx={{ mb: 1 }}
        >
          {formatDate(createdAt, locale)}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          component="div"
          sx={{
            maxHeight: '60px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            lineHeight: 1.4,
          }}
        >
          {typeof bodyPreview === 'string' && bodyPreview.trim() !== ''
            ? parser(bodyPreview)
            : translate('noNoteBody')}
        </Typography>
      </CardContent>
      <CardActions
        sx={{
          marginTop: 'auto',
          paddingX: 1,
          paddingBottom: 1,
          justifyContent: 'flex-end',
        }}
      >
        {isProcessing ? (
          <CircularProgress size={24} sx={{ m: 1 }} />
        ) : (
          <>
            <Tooltip title={translate('deleteAction')}>
              <IconButton
                aria-label={translate('deleteAction')}
                color="error"
                onClick={handleDeleteClick}
                size="small"
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            {archived
              ? onUnarchive && (
                  <Tooltip title={translate('unarchiveAction')}>
                    <IconButton
                      aria-label={translate('unarchiveAction')}
                      color="primary"
                      onClick={handleArchiveToggle}
                      size="small"
                    >
                      <UnarchiveIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )
              : onArchive && (
                  <Tooltip title={translate('archiveAction')}>
                    <IconButton
                      aria-label={translate('archiveAction')}
                      color="secondary"
                      onClick={handleArchiveToggle}
                      size="small"
                    >
                      <ArchiveIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )}
          </>
        )}
      </CardActions>
    </MotionCard>
  );
}

NoteItem.propTypes = {
  note: notePropTypes.isRequired,
  onDelete: PropTypes.func.isRequired,
  onArchive: PropTypes.func,
  onUnarchive: PropTypes.func,
};

NoteItem.defaultProps = {
  onArchive: undefined,
  onUnarchive: undefined,
};

export default NoteItem;
