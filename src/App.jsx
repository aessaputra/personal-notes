import React, { useState, useEffect } from 'react';
import { Routes, Route, useSearchParams, useNavigate } from 'react-router-dom';
import Navigation from './components/Navigation';
import HomePage from './pages/HomePage';
import ArchivedPage from './pages/ArchivedPage';
import NewNotePage from './pages/NewNotePage';
import NoteDetailPage from './pages/NoteDetailPage';
import NotFoundPage from './pages/NotFoundPage';
import SearchBar from './components/SearchBar';
import {
  getActiveNotes,
  getArchivedNotes,
  addNote,
  deleteNote,
  archiveNote,
  unarchiveNote,
} from './utils/local-data';
import './styles/App.css';

function App() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [notes, setNotes] = useState({
    active: getActiveNotes(),
    archived: getArchivedNotes(),
  });
  const [searchTerm, setSearchTerm] = useState(searchParams.get('keyword') || '');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setSearchTerm(searchParams.get('keyword') || '');
  }, [searchParams]);

  const updateNotesState = () => {
    setIsLoading(true);
    setNotes({
      active: getActiveNotes(),
      archived: getArchivedNotes(),
    });
    setIsLoading(false);
  };

  const onSearchHandler = (keyword) => {
    setSearchTerm(keyword);
    setSearchParams(keyword ? { keyword } : {});
  };

  const onAddNoteHandler = ({ title, body }) => {
    addNote({ title, body });
    updateNotesState();
    navigate('/');
  };

  const onDeleteNoteHandler = (id, isArchived) => {
    deleteNote(id);
    updateNotesState();
  };

  const onArchiveNoteHandler = (id) => {
    archiveNote(id);
    updateNotesState();
  };

  const onUnarchiveNoteHandler = (id) => {
    unarchiveNote(id);
    updateNotesState();
  };

  const filteredActiveNotes = notes.active.filter(note =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredArchivedNotes = notes.archived.filter(note =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Aplikasi Catatan Pribadi</h1>
        <Navigation />
        <SearchBar currentSearchTerm={searchTerm} onSearch={onSearchHandler} />
      </header>
      <main className="app-main">
        {isLoading ? <p className="loading-indicator">Memuat catatan...</p> : (
          <Routes>
            <Route
              path="/"
              element={
                <HomePage
                  activeNotes={filteredActiveNotes}
                  onDelete={onDeleteNoteHandler}
                  onArchive={onArchiveNoteHandler}
                />
              }
            />
            <Route
              path="/archived"
              element={
                <ArchivedPage
                  archivedNotes={filteredArchivedNotes}
                  onDelete={onDeleteNoteHandler}
                  onUnarchive={onUnarchiveNoteHandler}
                />
              }
            />
            <Route path="/notes/new" element={<NewNotePage onAddNote={onAddNoteHandler} />} />
            <Route
              path="/notes/:id"
              element={
                <NoteDetailPage
                  onDelete={onDeleteNoteHandler}
                  onArchive={onArchiveNoteHandler}
                  onUnarchive={onUnarchiveNoteHandler}
                />
              }
            />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        )}
      </main>
      <footer className="app-footer">
        <p>&copy; {new Date().getFullYear()} Aplikasi Catatan Pribadi</p>
      </footer>
    </div>
  );
}

export default App;