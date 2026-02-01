import { test, expect } from '@playwright/test';
import { setupApiMocks } from './helpers/apiMocks';

test.describe('Home Page', () => {
  test.beforeEach(async ({ page }) => {
    await setupApiMocks(page);
    await page.goto('/');
  });

  test('should load the home page with products', async ({ page }) => {
    // Wait for products to load using data-testid
    await expect(page.getByTestId('product-card').first()).toBeVisible();

    // Should display product count
    await expect(page.getByText(/\d+ RESULTS/i)).toBeVisible();
  });

  test('should have correct page title', async ({ page }) => {
    await expect(page).toHaveTitle(/Mobile Phone Catalog/);
  });

  test('should have proper accessibility attributes', async ({ page }) => {
    // Check lang attribute
    const html = page.locator('html');
    await expect(html).toHaveAttribute('lang', 'en');

    // Check main navigation exists
    await expect(page.getByRole('navigation', { name: /main/i })).toBeVisible();

    // Check product list has proper aria-label
    await expect(page.getByRole('region', { name: /product list/i })).toBeVisible();
  });

  test('should display header with logo and cart', async ({ page }) => {
    // Logo should be visible and link to home
    const logo = page.getByRole('link', { name: /go to home/i });
    await expect(logo).toBeVisible();

    // Cart badge should be visible
    await expect(page.getByTestId('cart-badge')).toBeVisible();
  });

  test('should display product cards with required info', async ({ page }) => {
    // Wait for first product card
    const firstCard = page.getByTestId('product-card').first();
    await expect(firstCard).toBeVisible();

    // Card should have image and price
    await expect(firstCard.locator('img')).toBeVisible();
    await expect(firstCard.getByText(/EUR/)).toBeVisible();
  });

  test('should display multiple products', async ({ page }) => {
    // Should show products (count varies based on API)
    const productCards = page.getByTestId('product-card');
    const count = await productCards.count();
    expect(count).toBeGreaterThan(0);
  });
});

test.describe('Search Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await setupApiMocks(page);
    await page.goto('/');
  });

  test('should have search input', async ({ page }) => {
    await expect(page.getByTestId('search-input')).toBeVisible();
  });

  test('should filter products when searching', async ({ page }) => {
    const searchInput = page.getByTestId('search-input');

    // Type using keyboard to ensure events fire in all browsers (including webkit)
    await searchInput.click();
    await searchInput.pressSequentially('Samsung', { delay: 50 });

    // Wait for debounce and URL to update (longer timeout for slower browsers)
    await expect(page).toHaveURL(/\?q=Samsung/i, { timeout: 15000 });

    // Should show filtered results (at least one Samsung product)
    await expect(page.getByTestId('product-card').first()).toBeVisible();
  });

  test('should clear search when clicking clear button', async ({ page }) => {
    const searchInput = page.getByTestId('search-input');

    // Type using keyboard to ensure events fire in all browsers
    await searchInput.click();
    await searchInput.pressSequentially('iPhone', { delay: 50 });
    await expect(page).toHaveURL(/\?q=iPhone/i, { timeout: 15000 });

    // Click clear button
    await page.getByTestId('search-clear-button').click();

    // URL should be clean
    await expect(page).toHaveURL('/');
    await expect(searchInput).toHaveValue('');
  });

  test('should show no results message for invalid search', async ({ page }) => {
    const searchInput = page.getByTestId('search-input');

    // Type using keyboard to ensure events fire in all browsers
    await searchInput.click();
    await searchInput.pressSequentially('xyznonexistent123', { delay: 30 });
    await expect(page).toHaveURL(/\?q=xyznonexistent123/, { timeout: 15000 });

    // Should show no results
    await expect(page.getByText(/no products found/i)).toBeVisible();
  });
});

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await setupApiMocks(page);
  });

  test('should navigate to product detail when clicking a product', async ({ page }) => {
    await page.goto('/');

    // Wait for products and click first one
    await page.getByTestId('product-card').first().click();

    // Should be on product detail page
    await expect(page).toHaveURL(/\/product\/.+/);
  });

  test('should navigate to cart from header', async ({ page }) => {
    await page.goto('/');

    await page.getByTestId('cart-badge').click();

    await expect(page).toHaveURL('/cart');
  });

  test('should navigate home when clicking logo', async ({ page }) => {
    await page.goto('/cart');

    const logo = page.getByRole('link', { name: /go to home/i });
    await logo.click();

    await expect(page).toHaveURL('/');
  });
});
