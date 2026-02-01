import { apiGet } from '@/shared/api';
import type { Product, ProductListItem } from '../model/types';

/**
 * Get all products
 */
export async function getProducts(): Promise<ProductListItem[]> {
  return apiGet<ProductListItem[]>('/products');
}

/**
 * Search products by query
 */
export async function searchProducts(query: string): Promise<ProductListItem[]> {
  const encodedQuery = encodeURIComponent(query.trim());
  return apiGet<ProductListItem[]>(`/products?search=${encodedQuery}`);
}

/**
 * Get product by ID
 */
export async function getProductById(id: string): Promise<Product> {
  return apiGet<Product>(`/products/${id}`);
}
