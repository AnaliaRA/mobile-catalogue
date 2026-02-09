import type { Metadata } from 'next';
import { CartView } from '@/views/cart';

export const metadata: Metadata = {
  title: 'Cart',
  description: 'Your shopping cart',
};

export default function CartPage() {
  return <CartView />;
}
