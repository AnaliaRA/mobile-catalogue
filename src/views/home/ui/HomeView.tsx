import { Suspense } from 'react';
import { ProductGrid } from '@/widgets/product-grid';
import { SearchBar } from '@/features/search-products';
import type { ProductListItem } from '@/entities/product';
import styles from './HomeView.module.scss';

export interface HomeViewProps {
  products: ProductListItem[];
  query?: string;
  className?: string;
}

export function HomeView({ products, className = '' }: HomeViewProps) {
  const resultsCount = products.length;
  const resultsText = `${resultsCount} RESULT${resultsCount !== 1 ? 'S' : ''}`;

  return (
    <div className={`${styles.container} ${className}`}>
      <div className={styles.searchSection}>
        <Suspense fallback={<div className={styles.searchPlaceholder} />}>
          <SearchBar className={styles.searchBar} />
        </Suspense>
      </div>
      <p className={styles.resultsCount}>{resultsText}</p>
      <ProductGrid products={products} />
    </div>
  );
}
