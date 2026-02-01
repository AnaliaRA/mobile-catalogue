import { Page } from '@playwright/test';
import {
  mockProducts,
  mockProductDetail,
  mockProductDetail2,
  mockEmptySearchResults,
} from '../fixtures/mockData';

// API base URL pattern to intercept
const API_URL_PATTERN = '**/products**';

/**
 * Set up API mocking for all product endpoints
 * This intercepts real API calls and returns mock data
 */
export async function setupApiMocks(page: Page) {
  // Intercept all API calls to /products
  await page.route(API_URL_PATTERN, async (route) => {
    const url = route.request().url();

    // GET /products/{id} - Product detail
    const productIdMatch = url.match(/\/products\/([^?]+)$/);
    if (productIdMatch) {
      const productId = productIdMatch[1];
      const product = getProductById(productId);

      if (product) {
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(product),
        });
      } else {
        return route.fulfill({
          status: 404,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Product not found' }),
        });
      }
    }

    // GET /products?search={query} - Search products
    const searchMatch = url.match(/\/products\?search=(.+)/);
    if (searchMatch) {
      const searchQuery = decodeURIComponent(searchMatch[1]).toLowerCase();

      // Return empty for nonsense queries
      if (searchQuery.includes('xyznonexistent')) {
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(mockEmptySearchResults),
        });
      }

      // Filter products by search query
      const filtered = mockProducts.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery) || p.brand.toLowerCase().includes(searchQuery)
      );

      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(filtered),
      });
    }

    // GET /products - All products
    if (url.endsWith('/products') || url.includes('/products?')) {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockProducts),
      });
    }

    // Fallback - continue to real API (shouldn't happen with proper mocking)
    return route.continue();
  });
}

/**
 * Get product detail by ID
 */
function getProductById(id: string) {
  const productMap: Record<string, typeof mockProductDetail> = {
    'SMG-S24U-256': mockProductDetail,
    'APL-IP15P-128': mockProductDetail2,
  };

  // For any other product ID, return the first mock with adjusted ID
  if (!productMap[id]) {
    return {
      ...mockProductDetail,
      id,
    };
  }

  return productMap[id];
}

/**
 * Set up API mocks with custom responses
 * Useful for testing specific scenarios
 */
export async function setupCustomApiMock(
  page: Page,
  responses: {
    products?: typeof mockProducts;
    productDetail?: typeof mockProductDetail;
  }
) {
  await page.route(API_URL_PATTERN, async (route) => {
    const url = route.request().url();

    // Product detail
    if (url.match(/\/products\/[^?]+$/)) {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(responses.productDetail || mockProductDetail),
      });
    }

    // Products list
    return route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(responses.products || mockProducts),
    });
  });
}

/**
 * Clear all route handlers
 */
export async function clearApiMocks(page: Page) {
  await page.unrouteAll();
}
