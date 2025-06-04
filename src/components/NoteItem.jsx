import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import parser from 'html-react-parser';

const formatDate = (dateString) => {
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('id-ID', options);
};

function NoteItem({ note, onDelete, onArchive, onUnarchive }) {
  const { id, title, createdAt, body, archived } = note;

  const bodyPreview = body.length > 150 ? `${body.substring(0, 147)}...` : body;

  return (
    <article className="note-item">
      <h3 className="note-item__title">
        <Link to={`/notes/${id}`}>{title}</Link>
      </h3>
      <p className="note-item__createdAt">{formatDate(createdAt)}</p>
      <div className="note-item__body">{parser(bodyPreview)}</div>
      <div className="note-item__actions">
        <button className="note-item__delete-button" onClick={() => onDelete(id, archived)}>
          Hapus
        </button>
        {onArchive && (
          <button className="note-item__archive-button" onClick={() => onArchive(id)}>
            Arsipkan
          </button>
        )}
        {onUnarchive && (
          <button className="note-item__archive-button" onClick={() => onUnarchive(id)}>
            Aktifkan
          </button>
        )}
      </div>
    </article>
  );
}

NoteItem.propTypes = {
  note: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    body: PropTypes.string.isRequired,
    archived: PropTypes.bool.isRequired,
  }).isRequired,
  onDelete: PropTypes.func.isRequired,
  onArchive: PropTypes.func,
  onUnarchive: PropTypes.func,
};

export default NoteItem;