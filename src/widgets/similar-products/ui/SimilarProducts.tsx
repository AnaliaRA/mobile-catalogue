import { ProductCard, type ProductListItem } from '@/entities/product';
import { HorizontalScroll } from '@/shared/ui';
import styles from './SimilarProducts.module.scss';

export interface SimilarProductsProps {
  products: ProductListItem[];
  className?: string;
}

export function SimilarProducts({ products, className = '' }: SimilarProductsProps) {
  if (products.length === 0) {
    return null;
  }

  return (
    <section className={`${styles.container} ${className}`}>
      <h2 className={styles.title}>SIMILAR ITEMS</h2>
      <HorizontalScroll>
        {products.map((product, index) => (
          <div key={`${product.id}-${index}`} className={styles.cardWrapper}>
            <ProductCard product={product} />
          </div>
        ))}
      </HorizontalScroll>
    </section>
  );
}
