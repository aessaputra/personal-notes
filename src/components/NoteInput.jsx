import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import {
  TextField,
  Button,
  Typography,
  Stack,
  CircularProgress,
  Box,
} from '@mui/material';
import { useLocale } from '../contexts/LocaleContext';
import useInput from '../hooks/useInput';
import Swal from 'sweetalert2';
import { useTheme } from '@mui/material/styles';

const MAX_TITLE_LENGTH = 50;

function NoteInput({ onAddNote }) {
  const { translate } = useLocale();
  const theme = useTheme();
  const [title, onTitleChangeHandler, setTitle] = useInput('');
  const [body, setBody] = useState('');
  const bodyInputRef = useRef(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleTitleChange = (event) => {
    if (event.target.value.length <= MAX_TITLE_LENGTH) {
      onTitleChangeHandler(event);
    }
  };

  const handleBodyInput = (event) => {
    setBody(event.target.innerHTML);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const plainTextBody = bodyInputRef.current
      ? bodyInputRef.current.innerText.trim()
      : '';

    if (title.trim() && plainTextBody) {
      setIsLoading(true);
      await onAddNote({ title: title.trim(), body });
      setIsLoading(false);
      setTitle('');
      setBody('');
      if (bodyInputRef.current) {
        bodyInputRef.current.innerHTML = '';
      }
    } else {
      Swal.fire({
        icon: 'warning',
        title: translate('validationWarningTitle'),
        text: translate('emptyNoteWarning'),
      });
    }
  };

  const titleCharsRemaining = MAX_TITLE_LENGTH - title.length;

  return (
    <Stack component="form" onSubmit={handleSubmit} spacing={2}>
      <Typography variant="caption" align="right" color="text.secondary">
        {translate('titleCharLimit', { count: titleCharsRemaining })}
      </Typography>
      <TextField
        required
        fullWidth
        label={translate('noteTitlePlaceholder')}
        variant="outlined"
        value={title}
        onChange={handleTitleChange}
        inputProps={{ maxLength: MAX_TITLE_LENGTH }}
        disabled={isLoading}
      />
      <Box
        ref={bodyInputRef}
        data-placeholder={translate('noteBodyPlaceholder')}
        contentEditable={!isLoading}
        suppressContentEditableWarning={true}
        onInput={handleBodyInput}
        sx={{
          minHeight: '200px',
          border: `1px solid ${theme.palette.divider}`,
          padding: theme.spacing(1.5, 2),
          borderRadius: theme.shape.borderRadius,
          bgcolor: isLoading
            ? theme.palette.action.disabledBackground
            : theme.palette.background.default,
          color: isLoading
            ? theme.palette.text.disabled
            : theme.palette.text.primary,
          outline: 'none',
          whiteSpace: 'pre-wrap',
          wordWrap: 'break-word',
          '&:focus': {
            borderColor: theme.palette.primary.main,
            boxShadow: `0 0 0 2px ${theme.palette.primary.light}40`,
          },
          '&:empty:before': {
            content: 'attr(data-placeholder)',
            color: theme.palette.text.disabled,
            pointerEvents: 'none',
            display: 'block',
          },
        }}
      />
      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={isLoading}
        sx={{ alignSelf: 'flex-start', mt: 2 }}
      >
        {isLoading ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          translate('createNoteButton')
        )}
      </Button>
    </Stack>
  );
}

NoteInput.propTypes = {
  onAddNote: PropTypes.func.isRequired,
};

export default NoteInput;
