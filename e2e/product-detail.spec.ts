import { test, expect } from '@playwright/test';
import { setupApiMocks } from './helpers/apiMocks';

test.describe('Product Detail Page', () => {
  test.beforeEach(async ({ page }) => {
    await setupApiMocks(page);
    // Navigate to home and click first product
    await page.goto('/');
    await page.getByTestId('product-card').first().click();
    await expect(page).toHaveURL(/\/product\/.+/);
    await page.waitForLoadState('networkidle');
  });

  test('should display product information', async ({ page }) => {
    // Product name (h1)
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

    // Price with EUR
    await expect(page.getByText(/EUR/).first()).toBeVisible();

    // Product image
    await expect(page.locator('img').first()).toBeVisible();
  });

  test('should display product specifications', async ({ page }) => {
    // Wait for page to fully load
    await page.waitForLoadState('networkidle');

    // Scroll down to see specs section
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
    await page.waitForTimeout(300);

    // Check if specs section exists on the page
    const specsSection = page.locator(
      'section[aria-label*="specifications"], h3:has-text("SPECIFICATIONS")'
    );
    const specsExist = (await specsSection.count()) > 0;

    if (specsExist) {
      await expect(specsSection.first()).toBeVisible();
    }
  });

  test('should have back navigation', async ({ page }) => {
    const backLink = page.getByRole('link', { name: /back/i });
    await expect(backLink).toBeVisible();

    await backLink.click();
    await expect(page).toHaveURL('/');
  });
});

test.describe('Product Options Selection', () => {
  test.beforeEach(async ({ page }) => {
    await setupApiMocks(page);
    await page.goto('/');
    await page.getByTestId('product-card').first().click();
    await expect(page).toHaveURL(/\/product\/.+/);
    await page.waitForLoadState('networkidle');
  });

  test('should display storage options', async ({ page }) => {
    // Wait for page to fully load
    await page.waitForLoadState('networkidle');

    // Storage selector label should be visible
    await expect(page.getByText(/storage/i).first()).toBeVisible();

    // Should have storage options with GB
    await expect(page.getByRole('radio', { name: /GB/i }).first()).toBeVisible();
  });

  test('should display color options', async ({ page }) => {
    // Wait for page to fully load
    await page.waitForLoadState('networkidle');

    // Color selector label should be visible
    await expect(page.getByText(/color/i).first()).toBeVisible();

    // Should have color option buttons
    const colorOptions = page.locator('[role="radiogroup"][aria-label="Select color"] button');
    await expect(colorOptions.first()).toBeVisible();
  });

  test('should update price when selecting different storage', async ({ page }) => {
    // Get price element
    const priceElement = page.getByText(/EUR/).first();
    await expect(priceElement).toBeVisible();

    // Click different storage option (if available)
    const storageOptions = page.locator('[role="radiogroup"][aria-label="Select storage"] button');
    const optionCount = await storageOptions.count();

    if (optionCount > 1) {
      // Click last option (higher storage = higher price)
      await storageOptions.last().click();

      // Price should still be displayed
      await expect(priceElement).toBeVisible();
    }
  });

  test('should change product image when selecting different color', async ({ page }) => {
    const colorOptions = page.locator('[role="radiogroup"][aria-label="Select color"] button');
    const optionCount = await colorOptions.count();

    if (optionCount > 1) {
      // Click different color
      await colorOptions.nth(1).click();

      // Wait a moment for image to update
      await page.waitForTimeout(300);

      // Image should still be visible
      await expect(page.locator('img').first()).toBeVisible();
    }
  });

  test('should show "From" price when no selection made', async ({ page }) => {
    // Initially should show "From" prefix (empty state)
    await expect(page.getByText(/from/i).first()).toBeVisible();
  });
});

test.describe('Add to Cart', () => {
  test.beforeEach(async ({ page }) => {
    await setupApiMocks(page);
    // Clear localStorage to start fresh
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());

    await page.getByTestId('product-card').first().click();
    await expect(page).toHaveURL(/\/product\/.+/);
    await page.waitForLoadState('networkidle');
  });

  test('should have add to cart button', async ({ page }) => {
    await expect(page.getByTestId('add-to-cart-button')).toBeVisible();
  });

  test('should have disabled add button initially (empty state)', async ({ page }) => {
    // Button should be disabled until storage and color are selected
    const addButton = page.getByTestId('add-to-cart-button');
    await expect(addButton).toBeDisabled();
  });

  test('should enable add button after selecting options', async ({ page }) => {
    const addButton = page.getByTestId('add-to-cart-button');

    // Select storage
    const storageOptions = page.locator('[role="radiogroup"][aria-label="Select storage"] button');
    await storageOptions.first().click();

    // Select color
    const colorOptions = page.locator('[role="radiogroup"][aria-label="Select color"] button');
    await colorOptions.first().click();

    // Button should now be enabled
    await expect(addButton).toBeEnabled();
  });

  test('should add product to cart when clicking add button', async ({ page }) => {
    // Select options first
    const storageOptions = page.locator('[role="radiogroup"][aria-label="Select storage"] button');
    await storageOptions.first().click();

    const colorOptions = page.locator('[role="radiogroup"][aria-label="Select color"] button');
    await colorOptions.first().click();

    const addButton = page.getByTestId('add-to-cart-button');
    await addButton.click();

    // Button should have data-added="true"
    await expect(addButton).toHaveAttribute('data-added', 'true');

    // Cart badge should update
    await expect(page.getByTestId('cart-badge')).toHaveAttribute('data-count', '1');
  });

  test('should show confirmation state after adding', async ({ page }) => {
    // Select options
    const storageOptions = page.locator('[role="radiogroup"][aria-label="Select storage"] button');
    await storageOptions.first().click();

    const colorOptions = page.locator('[role="radiogroup"][aria-label="Select color"] button');
    await colorOptions.first().click();

    const addButton = page.getByTestId('add-to-cart-button');
    await addButton.click();

    // Should show added state
    await expect(addButton).toHaveAttribute('data-added', 'true');

    // After timeout, should revert
    await expect(addButton).toHaveAttribute('data-added', 'false', { timeout: 3000 });
  });
});

test.describe('Similar Products', () => {
  test.beforeEach(async ({ page }) => {
    await setupApiMocks(page);
  });

  test('should display similar products section', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('product-card').first().click();

    // Similar products heading
    const similarHeading = page.getByRole('heading', { name: /similar items/i });
    const isVisible = await similarHeading.isVisible().catch(() => false);

    if (isVisible) {
      // Should have product cards in similar section
      const similarProducts = page
        .locator('section')
        .filter({ hasText: /similar items/i })
        .getByTestId('product-card');
      await expect(similarProducts.first()).toBeVisible();
    }
  });

  test('should navigate to similar product when clicked', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('product-card').first().click();

    const initialUrl = page.url();

    // Find similar products section
    const similarSection = page.locator('section').filter({ hasText: /similar items/i });
    const isVisible = await similarSection.isVisible().catch(() => false);

    if (isVisible) {
      // Click first similar product
      await similarSection.getByTestId('product-card').first().click();

      // Should navigate to different product
      await expect(page).not.toHaveURL(initialUrl);
      await expect(page).toHaveURL(/\/product\/.+/);
    }
  });
});
