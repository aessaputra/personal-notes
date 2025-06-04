import React from 'react';
import PropTypes from 'prop-types';
import NoteInput from '../components/NoteInput';

function NewNotePage({ onAddNote }) {
  return (
    <section className="add-new-page">
      <h2>Buat Catatan Baru</h2>
      <NoteInput onAddNote={onAddNote} />
    </section>
  );
}

NewNotePage.propTypes = {
  onAddNote: PropTypes.func.isRequired,
};

export default NewNotePage;