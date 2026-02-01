'use client';

import { useMemo } from 'react';
import {
  ProductImage,
  ProductSpecs,
  ProductPrice,
  type Product,
  type ColorOption,
  type StorageOption,
} from '@/entities/product';
import {
  ColorSelector,
  StorageSelector,
  useProductOptions,
} from '@/features/select-product-options';
import { AddToCartButton } from '@/features/add-to-cart';
import styles from './ProductDetail.module.scss';

export interface ProductDetailProps {
  product: Product;
  className?: string;
}

export function ProductDetail({ product, className = '' }: ProductDetailProps) {
  const { colorOptions, storageOptions, specs, name, brand } = product;

  const { selectedColor, selectedStorage, selectColor, selectStorage, currentPrice } =
    useProductOptions({
      colors: colorOptions,
      storages: storageOptions,
    });

  // Get image URL based on selected color, fallback to first color option
  const currentImageUrl = useMemo(() => {
    return selectedColor?.imageUrl || colorOptions[0]?.imageUrl || '';
  }, [selectedColor, colorOptions]);

  const isAddToCartDisabled = !selectedColor || !selectedStorage;

  const cartItem = useMemo(
    () => ({
      productId: product.id,
      name,
      brand,
      imageUrl: currentImageUrl,
      color: (selectedColor || colorOptions[0]) as ColorOption,
      storage: (selectedStorage || storageOptions[0]) as StorageOption,
    }),
    [
      product.id,
      name,
      brand,
      currentImageUrl,
      selectedColor,
      selectedStorage,
      colorOptions,
      storageOptions,
    ]
  );

  return (
    <div className={`${styles.wrapper} ${className}`}>
      <article className={styles.container}>
        <div className={styles.imageSection}>
          <ProductImage src={currentImageUrl} alt={`${brand} ${name}`} priority />
        </div>

        <div className={styles.infoSection}>
          <header className={styles.header}>
            <h1 className={styles.name}>{name}</h1>
            <ProductPrice price={currentPrice} size="lg" isStartingPrice={!selectedStorage} />
          </header>

          <div className={styles.options}>
            <StorageSelector
              storages={storageOptions}
              selectedStorage={selectedStorage}
              onSelect={selectStorage}
            />

            <ColorSelector
              colors={colorOptions}
              selectedColor={selectedColor}
              onSelect={selectColor}
            />
          </div>

          <div className={styles.actions}>
            <AddToCartButton product={cartItem} disabled={isAddToCartDisabled} />
          </div>
        </div>
      </article>

      <ProductSpecs specs={specs} className={styles.specs} />
    </div>
  );
}
