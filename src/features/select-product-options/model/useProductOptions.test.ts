import { renderHook, act } from '@testing-library/react';
import { useProductOptions } from './useProductOptions';
import type { ColorOption, StorageOption } from '@/entities/product';

const mockColors: ColorOption[] = [
  { name: 'Black', hexCode: '#000000', imageUrl: '/black.jpg' },
  { name: 'White', hexCode: '#ffffff', imageUrl: '/white.jpg' },
  { name: 'Blue', hexCode: '#0000ff', imageUrl: '/blue.jpg' },
];

const mockStorages: StorageOption[] = [
  { capacity: '128GB', price: 799 },
  { capacity: '256GB', price: 899 },
  { capacity: '512GB', price: 1099 },
];

describe('useProductOptions', () => {
  it('should initialize with no selections (empty state)', () => {
    const { result } = renderHook(() =>
      useProductOptions({ colors: mockColors, storages: mockStorages })
    );

    expect(result.current.selectedColor).toBeNull();
    expect(result.current.selectedStorage).toBeNull();
    // Should show minimum price when no storage selected
    expect(result.current.currentPrice).toBe(799);
    expect(result.current.isComplete).toBe(false);
  });

  it('should initialize with provided default color', () => {
    const { result } = renderHook(() =>
      useProductOptions({
        colors: mockColors,
        storages: mockStorages,
        defaultColor: mockColors[1],
      })
    );

    expect(result.current.selectedColor).toEqual(mockColors[1]);
  });

  it('should initialize with provided default storage', () => {
    const { result } = renderHook(() =>
      useProductOptions({
        colors: mockColors,
        storages: mockStorages,
        defaultStorage: mockStorages[2],
      })
    );

    expect(result.current.selectedStorage).toEqual(mockStorages[2]);
    expect(result.current.currentPrice).toBe(1099);
  });

  it('should update selected color', () => {
    const { result } = renderHook(() =>
      useProductOptions({ colors: mockColors, storages: mockStorages })
    );

    act(() => {
      result.current.selectColor(mockColors[2]);
    });

    expect(result.current.selectedColor).toEqual(mockColors[2]);
  });

  it('should update selected storage and price', () => {
    const { result } = renderHook(() =>
      useProductOptions({ colors: mockColors, storages: mockStorages })
    );

    act(() => {
      result.current.selectStorage(mockStorages[1]);
    });

    expect(result.current.selectedStorage).toEqual(mockStorages[1]);
    expect(result.current.currentPrice).toBe(899);
  });

  it('should update isComplete based on selections', () => {
    const { result } = renderHook(() =>
      useProductOptions({ colors: mockColors, storages: mockStorages })
    );

    // Initially incomplete (no selections)
    expect(result.current.isComplete).toBe(false);

    // Select color only - still incomplete
    act(() => {
      result.current.selectColor(mockColors[0]);
    });
    expect(result.current.isComplete).toBe(false);

    // Select storage - now complete
    act(() => {
      result.current.selectStorage(mockStorages[0]);
    });
    expect(result.current.isComplete).toBe(true);
  });
});
