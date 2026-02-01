import { test, expect } from '@playwright/test';
import { setupApiMocks } from './helpers/apiMocks';

const viewports = {
  mobile: { width: 375, height: 667, name: 'Mobile (375px)' },
  tablet: { width: 768, height: 1024, name: 'Tablet (768px)' },
  desktop: { width: 1440, height: 900, name: 'Desktop (1440px)' },
};

test.describe('Responsive Design - Home Page', () => {
  test.beforeEach(async ({ page }) => {
    await setupApiMocks(page);
  });

  for (const viewport of Object.values(viewports)) {
    test(`should display correctly on ${viewport.name}`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('/');

      // Header should be visible
      await expect(page.locator('header')).toBeVisible();

      // Products should load
      await expect(page.getByTestId('product-card').first()).toBeVisible();

      // No horizontal scrollbar
      const body = page.locator('body');
      const bodyWidth = await body.evaluate((el) => el.scrollWidth);
      expect(bodyWidth).toBeLessThanOrEqual(viewport.width + 20);
    });
  }

  test('search should work on Tablet (768px)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');

    const searchInput = page.getByTestId('search-input');
    await expect(searchInput).toBeVisible();

    // Use pressSequentially for cross-browser compatibility (webkit needs this)
    await searchInput.click();
    await searchInput.pressSequentially('Samsung', { delay: 50 });
    await expect(page).toHaveURL(/\?q=Samsung/i, { timeout: 15000 });
  });

  test('search should work on Desktop (1440px)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');

    const searchInput = page.getByTestId('search-input');
    await expect(searchInput).toBeVisible();

    // Use pressSequentially for cross-browser compatibility (webkit needs this)
    await searchInput.click();
    await searchInput.pressSequentially('Samsung', { delay: 50 });
    await expect(page).toHaveURL(/\?q=Samsung/i, { timeout: 15000 });
  });
});

test.describe('Responsive Design - Product Detail', () => {
  test.beforeEach(async ({ page }) => {
    await setupApiMocks(page);
  });

  for (const viewport of Object.values(viewports)) {
    test(`should display correctly on ${viewport.name}`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('/');

      // Navigate to product
      await page.getByTestId('product-card').first().click();
      await expect(page).toHaveURL(/\/product\/.+/);

      // Product image should be visible
      await expect(page.locator('img').first()).toBeVisible();

      // Add to cart button should be visible
      await expect(page.getByTestId('add-to-cart-button')).toBeVisible();

      // Options should be visible
      await expect(page.getByText(/storage/i).first()).toBeVisible();
      await expect(page.getByText(/color/i).first()).toBeVisible();
    });
  }
});

test.describe('Responsive Design - Cart', () => {
  test.beforeEach(async ({ page }) => {
    await setupApiMocks(page);
  });

  for (const viewport of Object.values(viewports)) {
    test(`should display correctly on ${viewport.name}`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });

      // Add item to cart first
      await page.goto('/');
      await page.evaluate(() => localStorage.clear());

      await page.getByTestId('product-card').first().click();
      await expect(page).toHaveURL(/\/product\/.+/);
      await page.waitForLoadState('networkidle');

      // Select options
      const storageOptions = page.locator(
        '[role="radiogroup"][aria-label="Select storage"] button'
      );
      await storageOptions.first().click();

      const colorOptions = page.locator('[role="radiogroup"][aria-label="Select color"] button');
      await colorOptions.first().click();

      await page.getByTestId('add-to-cart-button').click();

      // Go to cart
      await page.goto('/cart');

      // Cart content should be visible
      await expect(page.getByText(/cart/i).first()).toBeVisible();

      // Remove button should be accessible
      await expect(page.getByTestId('remove-from-cart-button')).toBeVisible();
    });
  }
});

test.describe('Responsive Design - Product Grid', () => {
  test.beforeEach(async ({ page }) => {
    await setupApiMocks(page);
  });

  test('should show 2 columns on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Wait for products
    await expect(page.getByTestId('product-card').first()).toBeVisible();

    // Check grid layout - on mobile should be narrower cards
    const firstCard = page.getByTestId('product-card').first();
    const cardWidth = await firstCard.evaluate((el) => el.getBoundingClientRect().width);

    // Card should be less than half viewport width
    expect(cardWidth).toBeLessThan(200);
  });

  test('should show more columns on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');

    // Wait for products
    await expect(page.getByTestId('product-card').first()).toBeVisible();

    // Check grid layout
    const firstCard = page.getByTestId('product-card').first();
    const cardWidth = await firstCard.evaluate((el) => el.getBoundingClientRect().width);

    expect(cardWidth).toBeGreaterThan(150);
    expect(cardWidth).toBeLessThan(400);
  });
});

test.describe('Responsive Design - Touch Interactions', () => {
  test.beforeEach(async ({ page }) => {
    await setupApiMocks(page);
  });

  test('should have touch-friendly button sizes on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    await page.getByTestId('product-card').first().click();

    // Add to cart button should be at least 44px height
    const addButton = page.getByTestId('add-to-cart-button');
    const buttonHeight = await addButton.evaluate((el) => el.getBoundingClientRect().height);

    expect(buttonHeight).toBeGreaterThanOrEqual(44);
  });
});

test.describe('Responsive Design - Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await setupApiMocks(page);
  });

  test('should have accessible header on all viewports', async ({ page }) => {
    for (const viewport of Object.values(viewports)) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('/');

      // Logo should be visible
      await expect(page.getByRole('link', { name: /go to home/i })).toBeVisible();

      // Cart should be visible
      await expect(page.getByTestId('cart-badge')).toBeVisible();
    }
  });
});
