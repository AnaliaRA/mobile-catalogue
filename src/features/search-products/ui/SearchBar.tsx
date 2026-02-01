'use client';

import { useCallback, useRef, type KeyboardEvent } from 'react';
import { Input } from '@/shared/ui';
import { CloseIcon } from '@/shared/ui';
import { useSearch } from '../model/useSearch';
import styles from './SearchBar.module.scss';

export interface SearchBarProps {
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
}

export function SearchBar({
  placeholder = 'Search for a smartphone...',
  className = '',
  autoFocus = false,
}: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { query, handleSearch, clearSearch } = useSearch();

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Escape') {
        clearSearch();
        inputRef.current?.blur();
      }
    },
    [clearSearch]
  );

  const handleClear = useCallback(() => {
    clearSearch();
    inputRef.current?.focus();
  }, [clearSearch]);

  return (
    <div className={`${styles.container} ${className}`}>
      <Input
        ref={inputRef}
        type="search"
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        autoFocus={autoFocus}
        rightIcon={query ? <CloseIcon className={styles.clearIcon} /> : undefined}
        onRightIconClick={query ? handleClear : undefined}
        rightIconLabel="Clear search"
        rightIconTestId="search-clear-button"
        aria-label="Search products"
        className={styles.input}
        data-testid="search-input"
      />
    </div>
  );
}
