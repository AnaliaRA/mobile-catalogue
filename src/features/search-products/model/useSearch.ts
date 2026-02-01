'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDebounce } from '@/shared/lib';
import { ROUTES } from '@/shared/config';

export interface UseSearchOptions {
  debounceMs?: number;
}

export interface UseSearchReturn {
  query: string;
  setQuery: (value: string) => void;
  handleSearch: (value: string) => void;
  clearSearch: () => void;
  isSearching: boolean;
}

export function useSearch(options: UseSearchOptions = {}): UseSearchReturn {
  const { debounceMs = 300 } = options;
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlQuery = searchParams.get('q') || '';

  const [query, setQuery] = useState(urlQuery);
  const [prevUrlQuery, setPrevUrlQuery] = useState(urlQuery);

  // Sync query state when URL changes externally (e.g., browser back/forward)
  if (prevUrlQuery !== urlQuery) {
    setQuery(urlQuery);
    setPrevUrlQuery(urlQuery);
  }

  const debouncedQuery = useDebounce(query, debounceMs);

  const isSearching = query !== debouncedQuery;

  useEffect(() => {
    // Skip when debounced query matches URL
    if (debouncedQuery === urlQuery) return;

    // Skip if user has already moved on (query changed but debounce hasn't caught up)
    if (query !== debouncedQuery) return;

    const trimmed = debouncedQuery.trim();

    if (trimmed) {
      router.push(`${ROUTES.home}?q=${encodeURIComponent(trimmed)}`);
    } else {
      router.push(ROUTES.home);
    }
  }, [debouncedQuery, query, router, urlQuery]);

  const handleSearch = useCallback((value: string) => {
    setQuery(value);
  }, []);

  const clearSearch = useCallback(() => {
    setQuery('');
    router.push(ROUTES.home);
  }, [router]);

  return {
    query,
    setQuery,
    handleSearch,
    clearSearch,
    isSearching,
  };
}
