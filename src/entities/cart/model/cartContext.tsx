'use client';

import { createContext, useContext, useCallback, useMemo, type ReactNode } from 'react';
import type { Cart, CartItem, CartContextValue } from './types';
import { useLocalStorage } from '@/shared/lib';
import { STORAGE_KEYS } from '@/shared/config';

const CartContext = createContext<CartContextValue | null>(null);

interface CartProviderProps {
  children: ReactNode;
}

const INITIAL_CART: Cart = { items: [] };

export function CartProvider({ children }: CartProviderProps) {
  const [cart, setCart, clearStorage] = useLocalStorage<Cart>(STORAGE_KEYS.cart, INITIAL_CART);

  const addItem = useCallback(
    (item: Omit<CartItem, 'id' | 'quantity'>) => {
      setCart((prev) => {
        const existingIndex = prev.items.findIndex(
          (i) =>
            i.productId === item.productId &&
            i.color.name === item.color.name &&
            i.storage.capacity === item.storage.capacity
        );

        if (existingIndex >= 0) {
          const newItems = [...prev.items];
          newItems[existingIndex] = {
            ...newItems[existingIndex],
            quantity: newItems[existingIndex].quantity + 1,
          };
          return { items: newItems };
        }

        const newItem: CartItem = {
          ...item,
          id: crypto.randomUUID(),
          quantity: 1,
        };
        return { items: [...prev.items, newItem] };
      });
    },
    [setCart]
  );

  const removeItem = useCallback(
    (id: string) => {
      setCart((prev) => ({
        items: prev.items.filter((item) => item.id !== id),
      }));
    },
    [setCart]
  );

  const clearCart = useCallback(() => {
    clearStorage();
  }, [clearStorage]);

  const isInCart = useCallback(
    (productId: string, colorName: string, capacity: string) => {
      return cart.items.some(
        (item) =>
          item.productId === productId &&
          item.color.name === colorName &&
          item.storage.capacity === capacity
      );
    },
    [cart.items]
  );

  const totalItems = useMemo(() => {
    return cart.items.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart.items]);

  const totalPrice = useMemo(() => {
    return cart.items.reduce((sum, item) => sum + item.storage.price * item.quantity, 0);
  }, [cart.items]);

  const value: CartContextValue = useMemo(
    () => ({
      cart,
      totalItems,
      totalPrice,
      addItem,
      removeItem,
      clearCart,
      isInCart,
    }),
    [cart, totalItems, totalPrice, addItem, removeItem, clearCart, isInCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
