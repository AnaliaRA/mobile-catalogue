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
  const initialQuery = searchParams.get('q') || '';

  const [query, setQuery] = useState(initialQuery);

  const debouncedQuery = useDebounce(query, debounceMs);

  const isSearching = query !== debouncedQuery;

  useEffect(() => {
    // Skip when debounced query matches URL
    if (debouncedQuery === initialQuery) return;

    const trimmed = debouncedQuery.trim();

    if (trimmed) {
      router.push(`${ROUTES.home}?q=${encodeURIComponent(trimmed)}`);
    } else {
      router.push(ROUTES.home);
    }
  }, [debouncedQuery, router, initialQuery]);

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
