'use client';

import Link from 'next/link';
import { ROUTES } from '@/shared/config';
import { CartIcon } from '@/shared/ui';
import { useCart } from '../model/cartContext';
import styles from './CartBadge.module.scss';

export interface CartBadgeProps {
  className?: string;
}

export function CartBadge({ className = '' }: CartBadgeProps) {
  const { totalItems } = useCart();

  return (
    <Link
      href={ROUTES.cart}
      className={`${styles.container} ${className}`}
      aria-label={`Shopping cart, ${totalItems} items`}
      data-testid="cart-badge"
      data-count={totalItems}
    >
      <CartIcon className={styles.icon} />
      <span className={styles.count}>{totalItems}</span>
    </Link>
  );
}
