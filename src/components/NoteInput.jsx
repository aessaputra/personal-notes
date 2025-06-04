import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';

const MAX_TITLE_LENGTH = 50;

function NoteInput({ onAddNote }) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const bodyInputRef = useRef(null);

  const onTitleChangeHandler = (event) => {
    if (event.target.value.length <= MAX_TITLE_LENGTH) {
      setTitle(event.target.value);
    }
  };

  const onBodyInputHandler = (event) => {
    setBody(event.target.innerHTML);
  };

  const onSubmitHandler = (event) => {
    event.preventDefault();
    if (title.trim() && body.trim()) {
      onAddNote({ title, body });
      setTitle('');
      setBody('');
      if (bodyInputRef.current) {
        bodyInputRef.current.innerHTML = '';
      }
    } else {
      alert('Judul dan isi catatan tidak boleh kosong!');
    }
  };

  const titleCharsRemaining = MAX_TITLE_LENGTH - title.length;

  return (
    <form className="add-new-page__input" onSubmit={onSubmitHandler}>
      <p className="add-new-page__title__char-limit">
        Sisa karakter judul: {titleCharsRemaining}
      </p>
      <input
        type="text"
        className="add-new-page__input__title"
        placeholder="Judul catatan..."
        value={title}
        onChange={onTitleChangeHandler}
        required
      />
      <div
        ref={bodyInputRef}
        className="add-new-page__input__body"
        data-placeholder="Tuliskan catatanmu di sini..."
        contentEditable
        suppressContentEditableWarning={true}
        onInput={onBodyInputHandler}
      />
      <button type="submit" className="add-new-page__action">
        Buat Catatan
      </button>
    </form>
  );
}

NoteInput.propTypes = {
  onAddNote: PropTypes.func.isRequired,
};

export default NoteInput;