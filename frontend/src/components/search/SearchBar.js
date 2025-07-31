import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setSearchQuery, setIsLoading } from '../../redux/slices/uiSlice';
import { searchService } from '../../services/api';
import { SearchInput } from '../../styles/StyledComponents';

const SearchBar = ({ onSearchResults }) => {
  const dispatch = useDispatch();
  const [query, setQuery] = useState('');
  const [typingTimeout, setTypingTimeout] = useState(null);

  const handleSearch = async (searchQuery) => {
    if (!searchQuery.trim()) return;
    
    try {
      dispatch(setIsLoading(true));
      dispatch(setSearchQuery(searchQuery));
      
      const response = await searchService.search(searchQuery);
      if (onSearchResults) {
        onSearchResults(response.data);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      dispatch(setIsLoading(false));
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    
    // Debounce search to avoid too many API calls
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }
    
    setTypingTimeout(
      setTimeout(() => {
        if (value.trim().length >= 2) {
          handleSearch(value);
        }
      }, 500)
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      handleSearch(query);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <SearchInput
        type="text"
        placeholder="Search for songs, artists, or albums..."
        value={query}
        onChange={handleChange}
        aria-label="Search"
      />
    </form>
  );
};

export default SearchBar;
