import Link from 'next/link';
import { ProductDetail } from '@/widgets/product-detail';
import { SimilarProducts } from '@/widgets/similar-products';
import { ChevronLeftIcon } from '@/shared/ui';
import { ROUTES } from '@/shared/config';
import type { Product } from '@/entities/product';
import styles from './ProductDetailView.module.scss';

export interface ProductDetailViewProps {
  product: Product;
  className?: string;
}

export function ProductDetailView({ product, className = '' }: ProductDetailViewProps) {
  return (
    <div className={`${styles.container} ${className}`}>
      <nav className={styles.breadcrumb} aria-label="Navigation">
        <Link href={ROUTES.home} className={styles.backLink}>
          <ChevronLeftIcon className={styles.backIcon} />
          <span>Back</span>
        </Link>
      </nav>

      <ProductDetail product={product} />

      {product.similarProducts.length > 0 && <SimilarProducts products={product.similarProducts} />}
    </div>
  );
}
