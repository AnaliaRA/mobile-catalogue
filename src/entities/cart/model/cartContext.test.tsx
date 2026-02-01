import { renderHook, act } from '@testing-library/react';
import { CartProvider, useCart } from './cartContext';
import type { ReactNode } from 'react';

// Mock localStorage
beforeEach(() => {
  localStorage.clear();
});

const wrapper = ({ children }: { children: ReactNode }) => <CartProvider>{children}</CartProvider>;

describe('CartContext', () => {
  describe('useCart', () => {
    it('should throw error when used outside CartProvider', () => {
      // Suppress console.error for this test
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        renderHook(() => useCart());
      }).toThrow('useCart must be used within a CartProvider');

      consoleSpy.mockRestore();
    });

    it('should provide initial empty cart', () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      expect(result.current.cart.items).toEqual([]);
      expect(result.current.totalItems).toBe(0);
      expect(result.current.totalPrice).toBe(0);
    });
  });

  describe('addItem', () => {
    it('should add new item to cart', () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      const newItem = {
        productId: 'prod-1',
        name: 'Phone',
        brand: 'Brand',
        imageUrl: '/image.jpg',
        color: { name: 'Black', hexCode: '#000', imageUrl: '/black.jpg' },
        storage: { capacity: '128GB', price: 999 },
      };

      act(() => {
        result.current.addItem(newItem);
      });

      expect(result.current.cart.items).toHaveLength(1);
      expect(result.current.cart.items[0].name).toBe('Phone');
      expect(result.current.cart.items[0].quantity).toBe(1);
      expect(result.current.totalItems).toBe(1);
      expect(result.current.totalPrice).toBe(999);
    });

    it('should increment quantity for existing item', () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      const item = {
        productId: 'prod-1',
        name: 'Phone',
        brand: 'Brand',
        imageUrl: '/image.jpg',
        color: { name: 'Black', hexCode: '#000', imageUrl: '/black.jpg' },
        storage: { capacity: '128GB', price: 999 },
      };

      act(() => {
        result.current.addItem(item);
        result.current.addItem(item);
      });

      expect(result.current.cart.items).toHaveLength(1);
      expect(result.current.cart.items[0].quantity).toBe(2);
      expect(result.current.totalItems).toBe(2);
      expect(result.current.totalPrice).toBe(1998);
    });

    it('should add as new item if color is different', () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      const itemBlack = {
        productId: 'prod-1',
        name: 'Phone',
        brand: 'Brand',
        imageUrl: '/image.jpg',
        color: { name: 'Black', hexCode: '#000', imageUrl: '/black.jpg' },
        storage: { capacity: '128GB', price: 999 },
      };

      const itemWhite = {
        ...itemBlack,
        color: { name: 'White', hexCode: '#fff', imageUrl: '/white.jpg' },
      };

      act(() => {
        result.current.addItem(itemBlack);
        result.current.addItem(itemWhite);
      });

      expect(result.current.cart.items).toHaveLength(2);
      expect(result.current.totalItems).toBe(2);
    });
  });

  describe('removeItem', () => {
    it('should remove item from cart', () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      const item = {
        productId: 'prod-1',
        name: 'Phone',
        brand: 'Brand',
        imageUrl: '/image.jpg',
        color: { name: 'Black', hexCode: '#000', imageUrl: '/black.jpg' },
        storage: { capacity: '128GB', price: 999 },
      };

      act(() => {
        result.current.addItem(item);
      });

      const itemId = result.current.cart.items[0].id;

      act(() => {
        result.current.removeItem(itemId);
      });

      expect(result.current.cart.items).toHaveLength(0);
      expect(result.current.totalItems).toBe(0);
    });
  });

  describe('clearCart', () => {
    it('should remove all items from cart', () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      const item = {
        productId: 'prod-1',
        name: 'Phone',
        brand: 'Brand',
        imageUrl: '/image.jpg',
        color: { name: 'Black', hexCode: '#000', imageUrl: '/black.jpg' },
        storage: { capacity: '128GB', price: 999 },
      };

      act(() => {
        result.current.addItem(item);
        result.current.addItem({ ...item, productId: 'prod-2' });
      });

      act(() => {
        result.current.clearCart();
      });

      expect(result.current.cart.items).toHaveLength(0);
      expect(result.current.totalItems).toBe(0);
      expect(result.current.totalPrice).toBe(0);
    });
  });

  describe('isInCart', () => {
    it('should return true if item is in cart', () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      const item = {
        productId: 'prod-1',
        name: 'Phone',
        brand: 'Brand',
        imageUrl: '/image.jpg',
        color: { name: 'Black', hexCode: '#000', imageUrl: '/black.jpg' },
        storage: { capacity: '128GB', price: 999 },
      };

      act(() => {
        result.current.addItem(item);
      });

      expect(result.current.isInCart('prod-1', 'Black', '128GB')).toBe(true);
    });

    it('should return false if item is not in cart', () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      expect(result.current.isInCart('prod-1', 'Black', '128GB')).toBe(false);
    });
  });
});
