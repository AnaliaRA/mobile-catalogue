'use client';

import { useCallback } from 'react';
import { Button, TrashIcon } from '@/shared/ui';
import { useRemoveFromCart } from '../model/useRemoveFromCart';
import styles from './RemoveFromCartButton.module.scss';

export interface RemoveFromCartButtonProps {
  itemId: string;
  itemName: string;
  variant?: 'button' | 'icon' | 'link';
  className?: string;
  onSuccess?: () => void;
}

export function RemoveFromCartButton({
  itemId,
  itemName,
  variant = 'link',
  className = '',
  onSuccess,
}: RemoveFromCartButtonProps) {
  const { removeFromCart, isRemoving } = useRemoveFromCart({ onSuccess });

  const handleClick = useCallback(() => {
    removeFromCart(itemId);
  }, [removeFromCart, itemId]);

  if (variant === 'icon') {
    return (
      <button
        type="button"
        className={`${styles.iconButton} ${className}`}
        onClick={handleClick}
        disabled={isRemoving}
        aria-label={`Remove ${itemName} from cart`}
      >
        <TrashIcon className={styles.icon} />
      </button>
    );
  }

  if (variant === 'link') {
    return (
      <button
        type="button"
        className={`${styles.linkButton} ${className}`}
        onClick={handleClick}
        disabled={isRemoving}
        data-testid="remove-from-cart-button"
      >
        {isRemoving ? 'Removing...' : 'Remove'}
      </button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleClick}
      disabled={isRemoving}
      isLoading={isRemoving}
      className={className}
      aria-label={`Remove ${itemName} from cart`}
    >
      <TrashIcon className={styles.buttonIcon} />
      Remove
    </Button>
  );
}
