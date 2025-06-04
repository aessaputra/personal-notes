import React from 'react';
import PropTypes from 'prop-types';
import NoteItem from './NoteItem';

function NoteList({ notes, onDelete, onArchive, onUnarchive, listType }) {
  if (!notes || notes.length === 0) {
    return (
      <p className="notes-list__empty-message">
        {listType === 'active' ? 'Tidak ada catatan aktif.' : 'Arsip kosong.'}
      </p>
    );
  }

  return (
    <div className="notes-list">
      {notes.map((note) => (
        <NoteItem
          key={note.id}
          note={note}
          onDelete={onDelete}
          onArchive={listType === 'active' ? onArchive : undefined}
          onUnarchive={listType === 'archived' ? onUnarchive : undefined}
        />
      ))}
    </div>
  );
}

const noteShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired,
  createdAt: PropTypes.string.isRequired,
  archived: PropTypes.bool.isRequired,
});

NoteList.propTypes = {
  notes: PropTypes.arrayOf(noteShape).isRequired,
  onDelete: PropTypes.func.isRequired,
  onArchive: PropTypes.func,
  onUnarchive: PropTypes.func,
  listType: PropTypes.oneOf(['active', 'archived']).isRequired,
};

export default NoteList;