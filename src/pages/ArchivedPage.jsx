import React from 'react';
import PropTypes from 'prop-types';
import NoteList from '../components/NoteList';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useLocale } from '../contexts/LocaleContext';

const noteItemShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  title: PropTypes.string,
  body: PropTypes.string,
  createdAt: PropTypes.string.isRequired,
  archived: PropTypes.bool.isRequired,
});

function ArchivedPage({ archivedNotes, onDelete, onUnarchive, isLoading }) {
  const { translate } = useLocale();

  return (
    <Box component="section" className="archived-page">
      <Typography
        variant="h5"
        component="h2"
        gutterBottom
        sx={{ color: 'primary.main', fontWeight: 'bold', mb: 2 }}
      >
        {translate('archivedNotes')}
      </Typography>
      <NoteList
        notes={archivedNotes}
        onDelete={onDelete}
        onUnarchive={onUnarchive}
        listType="archived"
        isLoading={isLoading}
      />
    </Box>
  );
}

ArchivedPage.propTypes = {
  archivedNotes: PropTypes.arrayOf(noteItemShape).isRequired,
  onDelete: PropTypes.func.isRequired,
  onUnarchive: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
};

ArchivedPage.defaultProps = {
  isLoading: false,
};

export default ArchivedPage;
