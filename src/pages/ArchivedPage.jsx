import React from 'react';
import PropTypes from 'prop-types';
import NoteList from '../components/NoteList';

function ArchivedPage({ archivedNotes, onDelete, onUnarchive }) {
  return (
    <section className="archived-page">
      <h2>Arsip Catatan</h2>
      <NoteList
        notes={archivedNotes}
        onDelete={onDelete}
        onUnarchive={onUnarchive}
        listType="archived"
      />
    </section>
  );
}

const noteShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
});

ArchivedPage.propTypes = {
  archivedNotes: PropTypes.arrayOf(noteShape).isRequired,
  onDelete: PropTypes.func.isRequired,
  onUnarchive: PropTypes.func.isRequired,
};

export default ArchivedPage;