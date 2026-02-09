import { apiGet } from '@/shared/api';
import type { Product, ProductListItem } from '../model/types';

const REVALIDATE_SECONDS = 60;

/**
 * Get all products (cached for 60s, revalidated in background)
 */
export async function getProducts(): Promise<ProductListItem[]> {
  return apiGet<ProductListItem[]>('/products', {
    next: { revalidate: REVALIDATE_SECONDS },
  });
}

/**
 * Search products by query (no cache - search results depend on input)
 */
export async function searchProducts(query: string): Promise<ProductListItem[]> {
  const encodedQuery = encodeURIComponent(query.trim());
  return apiGet<ProductListItem[]>(`/products?search=${encodedQuery}`);
}

/**
 * Get product by ID (cached for 60s, revalidated in background)
 */
export async function getProductById(id: string): Promise<Product> {
  return apiGet<Product>(`/products/${id}`, {
    next: { revalidate: REVALIDATE_SECONDS },
  });
}
