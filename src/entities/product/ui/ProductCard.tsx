'use client';

import { memo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ROUTES } from '@/shared/config';
import { formatPrice } from '@/shared/lib';
import type { ProductListItem } from '../model/types';
import styles from './ProductCard.module.scss';

export interface ProductCardProps {
  product: ProductListItem;
  priority?: boolean;
}

export const ProductCard = memo(function ProductCard({
  product,
  priority = false,
}: ProductCardProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const { id, name, brand, basePrice, imageUrl } = product;

  return (
    <article className={styles.card} data-testid="product-card">
      <Link
        href={ROUTES.product(id)}
        className={styles.link}
        aria-label={`View details of ${name}`}
      >
        <div className={`${styles.imageWrapper} relative`}>
          <div className={`${styles.spinner} ${isLoaded ? styles.spinnerHidden : ''}`} />
          <Image
            src={imageUrl}
            alt={`${brand} ${name}`}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
            className={styles.image}
            priority={priority}
            loading={priority ? 'eager' : 'lazy'}
            onLoad={() => setIsLoaded(true)}
          />
        </div>
        <div className={styles.content}>
          <span className={styles.brand}>{brand}</span>
          <div className={styles.nameRow}>
            <h3 className={styles.name}>{name}</h3>
            <span className={styles.price}>{formatPrice(basePrice)}</span>
          </div>
        </div>
      </Link>
    </article>
  );
});
