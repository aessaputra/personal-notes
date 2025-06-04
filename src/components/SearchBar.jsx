import React from 'react';
import PropTypes from 'prop-types';
import TextField from '@mui/material/TextField';
import { useLocale } from '../contexts/LocaleContext';

function SearchBar({ currentSearchTerm, onSearch }) {
  const { translate } = useLocale();

  return (
    <TextField
      fullWidth
      variant="outlined"
      placeholder={translate('searchPlaceholder')}
      value={currentSearchTerm}
      onChange={(e) => onSearch(e.target.value)}
    />
  );
}

SearchBar.propTypes = {
  currentSearchTerm: PropTypes.string.isRequired,
  onSearch: PropTypes.func.isRequired,
};

export default SearchBar;
