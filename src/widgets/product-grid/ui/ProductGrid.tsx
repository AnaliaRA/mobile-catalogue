import { ProductCard, type ProductListItem } from '@/entities/product';
import styles from './ProductGrid.module.scss';

export interface ProductGridProps {
  products: ProductListItem[];
  className?: string;
}

export function ProductGrid({ products, className = '' }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className={styles.empty}>
        <p className={styles.emptyText}>No products found</p>
      </div>
    );
  }

  // Prioritize first 5 products to cover above-the-fold on all screen sizes
  const PRIORITY_COUNT = 5;

  return (
    <section className={`${styles.grid} ${className}`} aria-label="Product list">
      {products.map((product, index) => (
        <ProductCard
          key={`${product.id}-${index}`}
          product={product}
          priority={index < PRIORITY_COUNT}
        />
      ))}
    </section>
  );
}
