import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CartProvider, useCart } from './model/cartContext';

/**
 * Cart Context Integration Tests
 *
 * These tests focus on edge cases and internal logic not covered by E2E tests:
 * - Quantity increment when adding same product twice
 * - clearCart function (not exposed in UI)
 * - Price calculation accuracy
 *
 * Happy paths (add/remove/display) are covered by E2E tests in e2e/cart.spec.ts
 */

// Minimal test component to verify context logic
function CartContextTest() {
  const { cart, totalItems, totalPrice, addItem, clearCart } = useCart();

  const sampleProduct = {
    productId: 'prod-1',
    name: 'iPhone 15 Pro',
    brand: 'Apple',
    imageUrl: '/iphone.jpg',
    color: { name: 'Titanio Negro', hexCode: '#1a1a1a', imageUrl: '/black.jpg' },
    storage: { capacity: '256GB', price: 1299 },
  };

  const sampleProduct2 = {
    productId: 'prod-2',
    name: 'Galaxy S24',
    brand: 'Samsung',
    imageUrl: '/galaxy.jpg',
    color: { name: 'Violet', hexCode: '#8b5cf6', imageUrl: '/violet.jpg' },
    storage: { capacity: '128GB', price: 899 },
  };

  return (
    <div>
      <div data-testid="total-items">{totalItems}</div>
      <div data-testid="total-price">{totalPrice}</div>
      <div data-testid="item-quantity">{cart.items[0]?.quantity ?? 0}</div>

      <button onClick={() => addItem(sampleProduct)} data-testid="add-product-1">
        Add iPhone
      </button>
      <button onClick={() => addItem(sampleProduct2)} data-testid="add-product-2">
        Add Galaxy
      </button>
      <button onClick={clearCart} data-testid="clear-cart">
        Clear Cart
      </button>
    </div>
  );
}

describe('Cart Context - Edge Cases', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it('should increment quantity when adding same product twice', async () => {
    const user = userEvent.setup();
    render(
      <CartProvider>
        <CartContextTest />
      </CartProvider>
    );

    await user.click(screen.getByTestId('add-product-1'));
    await user.click(screen.getByTestId('add-product-1'));

    expect(screen.getByTestId('total-items')).toHaveTextContent('2');
    expect(screen.getByTestId('total-price')).toHaveTextContent('2598'); // 1299 * 2
    expect(screen.getByTestId('item-quantity')).toHaveTextContent('2');
  });

  it('should calculate total correctly with multiple different products', async () => {
    const user = userEvent.setup();
    render(
      <CartProvider>
        <CartContextTest />
      </CartProvider>
    );

    await user.click(screen.getByTestId('add-product-1'));
    await user.click(screen.getByTestId('add-product-2'));

    expect(screen.getByTestId('total-items')).toHaveTextContent('2');
    expect(screen.getByTestId('total-price')).toHaveTextContent('2198'); // 1299 + 899
  });

  it('should clear all items from cart via clearCart function', async () => {
    const user = userEvent.setup();
    render(
      <CartProvider>
        <CartContextTest />
      </CartProvider>
    );

    await user.click(screen.getByTestId('add-product-1'));
    await user.click(screen.getByTestId('add-product-2'));
    expect(screen.getByTestId('total-items')).toHaveTextContent('2');

    await user.click(screen.getByTestId('clear-cart'));

    expect(screen.getByTestId('total-items')).toHaveTextContent('0');
    expect(screen.getByTestId('total-price')).toHaveTextContent('0');
  });
});
