import React from 'react';
import PropTypes from 'prop-types';
import NoteList from '../components/NoteList';

function HomePage({ activeNotes, onDelete, onArchive }) {
  return (
    <section className="homepage">
      <h2>Catatan Aktif</h2>
      <NoteList
        notes={activeNotes}
        onDelete={onDelete}
        onArchive={onArchive}
        listType="active"
      />
    </section>
  );
}

const noteShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
});

HomePage.propTypes = {
  activeNotes: PropTypes.arrayOf(noteShape).isRequired,
  onDelete: PropTypes.func.isRequired,
  onArchive: PropTypes.func.isRequired,
};

export default HomePage;