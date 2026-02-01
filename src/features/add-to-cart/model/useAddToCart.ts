'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useCart, type CartItemType } from '@/entities/cart';

export interface UseAddToCartOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export interface UseAddToCartReturn {
  addToCart: (item: Omit<CartItemType, 'id' | 'quantity'>) => void;
  isAdding: boolean;
  isAdded: boolean;
  reset: () => void;
}

export function useAddToCart(options: UseAddToCartOptions = {}): UseAddToCartReturn {
  const { onSuccess, onError } = options;
  const { addItem } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const addToCart = useCallback(
    (item: Omit<CartItemType, 'id' | 'quantity'>) => {
      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      setIsAdding(true);
      try {
        addItem(item);
        setIsAdded(true);
        onSuccess?.();

        // Reset isAdded after animation
        timeoutRef.current = setTimeout(() => setIsAdded(false), 2000);
      } catch (error) {
        onError?.(error as Error);
      } finally {
        setIsAdding(false);
      }
    },
    [addItem, onSuccess, onError]
  );

  const reset = useCallback(() => {
    // Clear timeout when manually resetting
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsAdding(false);
    setIsAdded(false);
  }, []);

  return {
    addToCart,
    isAdding,
    isAdded,
    reset,
  };
}
