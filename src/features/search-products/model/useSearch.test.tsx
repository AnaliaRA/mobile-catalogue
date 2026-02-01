import { renderHook, act } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import { useSearch } from './useSearch';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(() => new URLSearchParams()),
}));

describe('useSearch - Integration', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should initialize with empty query', () => {
    const { result } = renderHook(() => useSearch());

    expect(result.current.query).toBe('');
    expect(result.current.isSearching).toBe(false);
  });

  it('should update query on handleSearch', () => {
    const { result } = renderHook(() => useSearch());

    act(() => {
      result.current.handleSearch('iphone');
    });

    expect(result.current.query).toBe('iphone');
  });

  it('should debounce navigation using useDebounce hook', () => {
    const { result } = renderHook(() => useSearch({ debounceMs: 300 }));

    act(() => {
      result.current.handleSearch('i');
    });
    act(() => {
      result.current.handleSearch('ip');
    });
    act(() => {
      result.current.handleSearch('iph');
    });

    // Should not have navigated yet (debounce pending)
    expect(mockPush).not.toHaveBeenCalled();

    // Fast forward past debounce
    act(() => {
      jest.advanceTimersByTime(300);
    });

    // Should navigate with final value
    expect(mockPush).toHaveBeenCalledWith('/?q=iph');
  });

  it('should navigate to home without query when cleared', () => {
    const { result } = renderHook(() => useSearch());

    act(() => {
      result.current.handleSearch('test');
    });

    act(() => {
      result.current.clearSearch();
    });

    expect(result.current.query).toBe('');
    expect(mockPush).toHaveBeenCalledWith('/');
  });

  it('should trim whitespace from query', () => {
    const { result } = renderHook(() => useSearch());

    act(() => {
      result.current.handleSearch('  samsung  ');
    });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(mockPush).toHaveBeenCalledWith('/?q=samsung');
  });

  it('should navigate to home for empty trimmed query', () => {
    const { result } = renderHook(() => useSearch());

    act(() => {
      result.current.handleSearch('a'); // First set a value
    });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    act(() => {
      result.current.handleSearch('   '); // Then set whitespace only
    });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(mockPush).toHaveBeenLastCalledWith('/');
  });
});
