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

function HomePage({ activeNotes, onDelete, onArchive, isLoading }) {
  const { translate } = useLocale();

  return (
    <Box component="section" className="homepage">
      <Typography
        variant="h5"
        component="h2"
        gutterBottom
        sx={{ color: 'primary.main', fontWeight: 'bold', mb: 2 }}
      >
        {translate('activeNotes')}
      </Typography>
      <NoteList
        notes={activeNotes}
        onDelete={onDelete}
        onArchive={onArchive}
        listType="active"
        isLoading={isLoading}
      />
    </Box>
  );
}

HomePage.propTypes = {
  activeNotes: PropTypes.arrayOf(noteItemShape).isRequired,
  onDelete: PropTypes.func.isRequired,
  onArchive: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
};

HomePage.defaultProps = {
  isLoading: false,
};

export default HomePage;
