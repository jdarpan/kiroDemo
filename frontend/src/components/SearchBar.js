import React, { useState, useEffect, useCallback } from 'react';
import './SearchBar.css';

/**
 * SearchBar component for filtering accounts
 * Features:
 * - Debounced search to reduce API calls
 * - Clear search functionality
 * - Real-time search as user types
 */
function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');

  // Debounce search to avoid excessive API calls
  useEffect(() => {
    // Set up debounce timer
    const debounceTimer = setTimeout(() => {
      // Trigger search after 300ms of no typing
      onSearch(query);
    }, 300);

    // Cleanup function to clear timer on each keystroke
    return () => {
      clearTimeout(debounceTimer);
    };
  }, [query, onSearch]);

  /**
   * Handle input change
   */
  const handleChange = (e) => {
    setQuery(e.target.value);
  };

  /**
   * Handle form submission (when user presses Enter)
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    // Immediately trigger search on submit
    onSearch(query);
  };

  /**
   * Clear search and reset results
   */
  const handleClear = useCallback(() => {
    setQuery('');
    onSearch('');
  }, [onSearch]);

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <div className="search-input-wrapper">
        <input
          type="text"
          placeholder="Search by account number, bank name, or customer info..."
          value={query}
          onChange={handleChange}
          className="search-input"
          aria-label="Search accounts"
        />
        {query && (
          <button
            type="button"
            className="clear-button"
            onClick={handleClear}
            aria-label="Clear search"
            title="Clear search"
          >
            ✕
          </button>
        )}
      </div>
      <button type="submit" className="search-button">
        Search
      </button>
    </form>
  );
}

export default SearchBar;
