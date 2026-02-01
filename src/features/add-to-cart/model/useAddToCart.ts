'use client';

import { useCallback, useState } from 'react';
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

  const addToCart = useCallback(
    (item: Omit<CartItemType, 'id' | 'quantity'>) => {
      setIsAdding(true);
      try {
        addItem(item);
        setIsAdded(true);
        onSuccess?.();

        // Reset isAdded after animation
        setTimeout(() => setIsAdded(false), 2000);
      } catch (error) {
        onError?.(error as Error);
      } finally {
        setIsAdding(false);
      }
    },
    [addItem, onSuccess, onError]
  );

  const reset = useCallback(() => {
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
