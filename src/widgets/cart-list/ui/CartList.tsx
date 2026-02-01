'use client';

import Link from 'next/link';
import { CartItem, useCart } from '@/entities/cart';
import { useRemoveFromCart } from '@/features/remove-from-cart';
import { Button } from '@/shared/ui';
import { ROUTES } from '@/shared/config';
import { formatPrice } from '@/shared/lib';
import buttonStyles from '@/shared/ui/button/Button.module.scss';
import styles from './CartList.module.scss';

export interface CartListProps {
  className?: string;
}

export function CartList({ className = '' }: CartListProps) {
  const { cart, totalItems, totalPrice } = useCart();
  const { removeFromCart } = useRemoveFromCart();

  const isEmpty = totalItems === 0;

  return (
    <div
      className={`${styles.container} ${className}`}
      data-testid={isEmpty ? 'empty-cart' : undefined}
    >
      <h1 className={styles.title}>Cart ({totalItems})</h1>

      {!isEmpty && (
        <div className={styles.list}>
          {cart.items.map((item) => (
            <CartItem key={item.id} item={item} onRemove={removeFromCart} />
          ))}
        </div>
      )}

      <footer className={styles.footer}>
        {!isEmpty && (
          <div className={styles.totalRow}>
            <span className={styles.totalLabel}>TOTAL</span>
            <span className={styles.totalValue}>{formatPrice(totalPrice)}</span>
          </div>
        )}

        <div className={styles.buttonsRow}>
          <Link
            href={ROUTES.home}
            className={`${buttonStyles.button} ${buttonStyles.secondary} ${buttonStyles.lg} ${styles.continueButton}`}
          >
            Continue Shopping
          </Link>

          {!isEmpty && (
            <Button variant="primary" size="lg" className={styles.payButton}>
              Pay
            </Button>
          )}
        </div>
      </footer>
    </div>
  );
}
