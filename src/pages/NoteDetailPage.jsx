import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useParams, useNavigate } from 'react-router-dom';
import parser from 'html-react-parser';
import { getNote } from '../utils/local-data';
import NotFoundPage from './NotFoundPage';

const formatDate = (dateString) => {
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('id-ID', options);
};

function NoteDetailPage({ onDelete, onArchive, onUnarchive }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const fetchedNote = getNote(id);
    setNote(fetchedNote);
    setIsLoading(false);
  }, [id]);

  const handleDelete = () => {
    if (window.confirm('Apakah Anda yakin ingin menghapus catatan ini?')) {
      onDelete(note.id, note.archived);
      navigate(note.archived ? '/archived' : '/');
    }
  };

  const handleArchiveToggle = () => {
    if (note.archived) {
      onUnarchive(note.id);
    } else {
      onArchive(note.id);
    }
    const updatedNote = getNote(id);
    setNote(updatedNote); 
  };

  if (isLoading) {
    return <p className="loading-indicator">Memuat catatan...</p>;
  }

  if (!note) {
    return <NotFoundPage />;
  }

  return (
    <section className="detail-page">
      <h2 className="detail-page__title">{note.title}</h2>
      <p className="detail-page__createdAt">{formatDate(note.createdAt)}</p>
      <div className="detail-page__body">{parser(note.body)}</div>
      <div className="detail-page__actions">
        <button className="action action--danger" onClick={handleDelete}>
          Hapus
        </button>
        <button className="action" onClick={handleArchiveToggle}>
          {note.archived ? 'Aktifkan dari Arsip' : 'Arsipkan'}
        </button>
      </div>
    </section>
  );
}

NoteDetailPage.propTypes = {
  onDelete: PropTypes.func.isRequired,
  onArchive: PropTypes.func.isRequired,
  onUnarchive: PropTypes.func.isRequired,
};

export default NoteDetailPage;