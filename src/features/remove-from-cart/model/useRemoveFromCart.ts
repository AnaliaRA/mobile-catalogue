'use client';

import { useCallback, useState } from 'react';
import { useCart } from '@/entities/cart';

export interface UseRemoveFromCartOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export interface UseRemoveFromCartReturn {
  removeFromCart: (itemId: string) => void;
  isRemoving: boolean;
}

export function useRemoveFromCart(options: UseRemoveFromCartOptions = {}): UseRemoveFromCartReturn {
  const { onSuccess, onError } = options;
  const { removeItem } = useCart();
  const [isRemoving, setIsRemoving] = useState(false);

  const removeFromCart = useCallback(
    (itemId: string) => {
      setIsRemoving(true);
      try {
        removeItem(itemId);
        onSuccess?.();
      } catch (error) {
        onError?.(error as Error);
      } finally {
        setIsRemoving(false);
      }
    },
    [removeItem, onSuccess, onError]
  );

  return {
    removeFromCart,
    isRemoving,
  };
}
