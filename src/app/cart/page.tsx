import type { Metadata } from 'next';
import { CartView } from '@/views/cart';

// Force dynamic rendering to support client-side cart state
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Cart',
  description: 'Your shopping cart',
};

export default function CartPage() {
  return <CartView />;
}
