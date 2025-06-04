import React from 'react';
import PropTypes from 'prop-types';
import NoteInput from '../components/NoteInput';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useLocale } from '../contexts/LocaleContext';

function NewNotePage({ onAddNote }) {
  const { translate } = useLocale();

  return (
    <Box component="section" className="add-new-page">
      <Typography
        variant="h5"
        component="h2"
        gutterBottom
        sx={{ color: 'primary.main', fontWeight: 'bold', mb: 3 }}
      >
        {translate('newNoteTitle')}
      </Typography>
      <NoteInput onAddNote={onAddNote} />
    </Box>
  );
}

NewNotePage.propTypes = {
  onAddNote: PropTypes.func.isRequired,
};

export default NewNotePage;
