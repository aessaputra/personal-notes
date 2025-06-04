import React from 'react';
import PropTypes from 'prop-types';
import NoteItem from './NoteItem';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { useLocale } from '../contexts/LocaleContext';

import { motion, AnimatePresence } from 'framer-motion';

const listContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
};

const noteItemShapeForList = PropTypes.shape({
  id: PropTypes.string.isRequired,
  title: PropTypes.string,
  body: PropTypes.string,
  createdAt: PropTypes.string.isRequired,
  archived: PropTypes.bool.isRequired,
});

function NoteList({
  notes,
  onDelete,
  onArchive,
  onUnarchive,
  listType,
  isLoading,
}) {
  const { translate } = useLocale();

  if (isLoading && (!notes || notes.length === 0)) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          py: 5,
          minHeight: '200px',
        }}
      >
        <CircularProgress />
        <Typography sx={{ ml: 2, color: 'text.secondary' }}>
          {translate('loadingNotes')}
        </Typography>
      </Box>
    );
  }

  if (!notes || notes.length === 0) {
    return (
      <Typography
        sx={{
          textAlign: 'center',
          paddingY: 5,
          color: 'text.secondary',
          marginTop: 2,
          minHeight: '100px',
        }}
      >
        {listType === 'active'
          ? translate('noActiveNotes')
          : translate('noArchivedNotes')}
      </Typography>
    );
  }

  return (
    <motion.div
      variants={listContainerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        marginTop: '16px',
      }}
    >
      <AnimatePresence>
        {notes.map((note) => (
          <NoteItem
            key={note.id}
            note={note}
            onDelete={onDelete}
            onArchive={listType === 'active' ? onArchive : undefined}
            onUnarchive={listType === 'archived' ? onUnarchive : undefined}
          />
        ))}
      </AnimatePresence>
    </motion.div>
  );
}

NoteList.propTypes = {
  notes: PropTypes.arrayOf(noteItemShapeForList).isRequired,
  onDelete: PropTypes.func.isRequired,
  onArchive: PropTypes.func,
  onUnarchive: PropTypes.func,
  listType: PropTypes.oneOf(['active', 'archived']).isRequired,
  isLoading: PropTypes.bool,
};

NoteList.defaultProps = {
  onArchive: undefined,
  onUnarchive: undefined,
  isLoading: false,
};

export default NoteList;
