'use client';

import { CartList } from '@/widgets/cart-list';
import styles from './CartView.module.scss';

export interface CartViewProps {
  className?: string;
}

export function CartView({ className = '' }: CartViewProps) {
  return (
    <div className={`${styles.container} ${className}`}>
      <CartList />
    </div>
  );
}
