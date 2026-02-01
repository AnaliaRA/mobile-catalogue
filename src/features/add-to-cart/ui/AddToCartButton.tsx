'use client';

import { useCallback } from 'react';
import { Button } from '@/shared/ui';
import { CheckIcon } from '@/shared/ui';
import type { CartItemType } from '@/entities/cart';
import { useAddToCart } from '../model/useAddToCart';
import styles from './AddToCartButton.module.scss';

export interface AddToCartButtonProps {
  product: Omit<CartItemType, 'id' | 'quantity'>;
  disabled?: boolean;
  fullWidth?: boolean;
  className?: string;
  onSuccess?: () => void;
}

export function AddToCartButton({
  product,
  disabled = false,
  fullWidth = true,
  className = '',
  onSuccess,
}: AddToCartButtonProps) {
  const { addToCart, isAdding, isAdded } = useAddToCart({ onSuccess });

  const handleClick = useCallback(() => {
    addToCart(product);
  }, [addToCart, product]);

  const buttonText = isAdded ? 'ADDED' : 'ADD';

  return (
    <Button
      variant="primary"
      size="lg"
      fullWidth={fullWidth}
      disabled={disabled || isAdding}
      isLoading={isAdding}
      onClick={handleClick}
      className={`${styles.button} ${isAdded ? styles.added : ''} ${className}`}
      aria-label={`Add ${product.name} to cart`}
      data-testid="add-to-cart-button"
      data-added={isAdded}
    >
      {isAdded && <CheckIcon className={styles.checkIcon} />}
      {buttonText}
    </Button>
  );
}
