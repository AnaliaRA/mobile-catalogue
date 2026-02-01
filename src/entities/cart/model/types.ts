import type { ColorOption, StorageOption } from '@/entities/product';

export interface CartItem {
  id: string; // Unique cart item ID
  productId: string;
  name: string;
  brand: string;
  imageUrl: string;
  color: ColorOption;
  storage: StorageOption;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
}

export interface CartContextValue {
  cart: Cart;
  totalItems: number;
  totalPrice: number;
  addItem: (item: Omit<CartItem, 'id' | 'quantity'>) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  isInCart: (productId: string, colorName: string, capacity: string) => boolean;
}
