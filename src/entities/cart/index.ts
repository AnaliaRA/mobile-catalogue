// Types
export type { Cart, CartItem as CartItemType, CartContextValue } from './model/types';

// Context
export { CartProvider, useCart } from './model/cartContext';

// UI Components
export { CartItem } from './ui/CartItem';
export type { CartItemProps } from './ui/CartItem';

export { CartBadge } from './ui/CartBadge';
export type { CartBadgeProps } from './ui/CartBadge';
