'use client';

import { useState, useCallback, useMemo } from 'react';
import type { ColorOption, StorageOption } from '@/entities/product';

export interface UseProductOptionsProps {
  colors: ColorOption[];
  storages: StorageOption[];
  defaultColor?: ColorOption | null;
  defaultStorage?: StorageOption | null;
}

export interface UseProductOptionsReturn {
  selectedColor: ColorOption | null;
  selectedStorage: StorageOption | null;
  selectColor: (color: ColorOption) => void;
  selectStorage: (storage: StorageOption) => void;
  currentPrice: number;
  isComplete: boolean;
}

export function useProductOptions({
  storages,
  defaultColor = null,
  defaultStorage = null,
}: UseProductOptionsProps): UseProductOptionsReturn {
  // Start with null (no selection) unless defaults are provided
  const [selectedColor, setSelectedColor] = useState<ColorOption | null>(defaultColor);
  const [selectedStorage, setSelectedStorage] = useState<StorageOption | null>(defaultStorage);

  const selectColor = useCallback((color: ColorOption) => {
    setSelectedColor(color);
  }, []);

  const selectStorage = useCallback((storage: StorageOption) => {
    setSelectedStorage(storage);
  }, []);

  // Use selected storage price, or minimum price when nothing selected
  const currentPrice = useMemo(() => {
    if (selectedStorage) {
      return selectedStorage.price;
    }
    if (storages.length === 0) return 0;
    return Math.min(...storages.map((s) => s.price));
  }, [selectedStorage, storages]);

  const isComplete = useMemo(() => {
    return !!selectedColor && !!selectedStorage;
  }, [selectedColor, selectedStorage]);

  return {
    selectedColor,
    selectedStorage,
    selectColor,
    selectStorage,
    currentPrice,
    isComplete,
  };
}
