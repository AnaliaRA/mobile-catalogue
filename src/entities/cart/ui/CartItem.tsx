import { memo } from 'react';
import Image from 'next/image';
import { formatPrice } from '@/shared/lib';
import type { CartItem as CartItemType } from '../model/types';
import styles from './CartItem.module.scss';

export interface CartItemProps {
  item: CartItemType;
  onRemove?: (id: string) => void;
  showRemoveButton?: boolean;
}

export const CartItem = memo(function CartItem({
  item,
  onRemove,
  showRemoveButton = true,
}: CartItemProps) {
  const { id, name, brand, imageUrl, color, storage, quantity } = item;
  const totalPrice = storage.price * quantity;

  return (
    <article className={styles.item} data-testid="cart-item">
      <div className={`${styles.imageWrapper} relative`}>
        <Image
          src={imageUrl}
          alt={`${brand} ${name}`}
          fill
          sizes="(max-width: 768px) 150px, 200px"
          className={styles.image}
        />
      </div>

      <div className={styles.details}>
        <h3 className={styles.name} data-testid="cart-item-name">
          {name}
        </h3>
        <span className={styles.specs}>
          {storage.capacity} | {color.name}
        </span>
        <span className={styles.price}>{formatPrice(totalPrice)}</span>
        {quantity > 1 && (
          <span className={styles.quantity} data-testid="cart-item-quantity">
            Qty: {quantity}
          </span>
        )}

        {showRemoveButton && onRemove && (
          <button
            type="button"
            className={styles.removeButton}
            onClick={() => onRemove(id)}
            aria-label={`Remove ${name} from cart`}
            data-testid="remove-from-cart-button"
          >
            Remove
          </button>
        )}
      </div>
    </article>
  );
});
