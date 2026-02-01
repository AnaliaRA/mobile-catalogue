import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CartProvider } from '@/entities/cart';
import { AddToCartButton } from './ui/AddToCartButton';
import type { ColorOption, StorageOption } from '@/entities/product';

/**
 * AddToCartButton Integration Tests
 *
 * These tests focus on component-specific behavior not covered by E2E:
 * - disabled prop behavior
 * - onSuccess callback
 * - accessible label generation
 *
 * Happy paths (add to cart, visual states) are covered by E2E tests in e2e/product-detail.spec.ts
 */

describe('AddToCartButton - Component Behavior', () => {
  const mockColor: ColorOption = {
    name: 'Negro',
    hexCode: '#000000',
    imageUrl: '/black.jpg',
  };

  const mockStorage: StorageOption = {
    capacity: '256GB',
    price: 1199,
  };

  const mockProduct = {
    productId: 'test-product-1',
    name: 'Test Phone',
    brand: 'TestBrand',
    imageUrl: '/test.jpg',
    color: mockColor,
    storage: mockStorage,
  };

  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it('should be disabled when disabled prop is true', () => {
    render(
      <CartProvider>
        <AddToCartButton product={mockProduct} disabled />
      </CartProvider>
    );

    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('should call onSuccess callback when provided', async () => {
    const user = userEvent.setup();
    const onSuccess = jest.fn();

    render(
      <CartProvider>
        <AddToCartButton product={mockProduct} onSuccess={onSuccess} />
      </CartProvider>
    );

    await user.click(screen.getByTestId('add-to-cart-button'));

    expect(onSuccess).toHaveBeenCalledTimes(1);
  });

  it('should have accessible label with product name', () => {
    render(
      <CartProvider>
        <AddToCartButton product={mockProduct} />
      </CartProvider>
    );

    expect(screen.getByRole('button', { name: /add test phone to cart/i })).toBeInTheDocument();
  });
});
