import { formatPrice } from '@/shared/lib';
import styles from './ProductPrice.module.scss';

export interface ProductPriceProps {
  price: number;
  size?: 'sm' | 'md' | 'lg';
  isStartingPrice?: boolean;
  className?: string;
}

export function ProductPrice({
  price,
  size = 'md',
  isStartingPrice = false,
  className = '',
}: ProductPriceProps) {
  const priceClasses = [styles.price, styles[size], className].filter(Boolean).join(' ');
  const priceText = isStartingPrice ? `From ${formatPrice(price)}` : formatPrice(price);

  return <span className={priceClasses}>{priceText}</span>;
}
