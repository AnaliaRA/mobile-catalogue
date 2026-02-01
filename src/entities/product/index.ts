// Types
export type {
  Product,
  ProductListItem,
  ProductSpecs as ProductSpecsType,
  ColorOption,
  StorageOption,
} from './model/types';

// API
export { getProducts, searchProducts, getProductById } from './api/productApi';

// UI Components
export { ProductCard } from './ui/ProductCard';
export type { ProductCardProps } from './ui/ProductCard';

export { ProductImage } from './ui/ProductImage';
export type { ProductImageProps } from './ui/ProductImage';

export { ProductSpecs } from './ui/ProductSpecs';
export type { ProductSpecsProps } from './ui/ProductSpecs';

export { ProductPrice } from './ui/ProductPrice';
export type { ProductPriceProps } from './ui/ProductPrice';
