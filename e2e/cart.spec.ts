import { test, expect } from '@playwright/test';
import { setupApiMocks } from './helpers/apiMocks';

test.describe('Cart Page - Empty State', () => {
  test.beforeEach(async ({ page }) => {
    await setupApiMocks(page);
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
  });

  test('should show empty cart message', async ({ page }) => {
    await page.goto('/cart');

    await expect(page.getByTestId('empty-cart')).toBeVisible();
  });

  test('should have continue shopping link', async ({ page }) => {
    await page.goto('/cart');

    const continueButton = page.getByRole('link', { name: /continue shopping/i });
    await expect(continueButton).toBeVisible();

    await continueButton.scrollIntoViewIfNeeded();
    await continueButton.evaluate((el: HTMLElement) => el.click());
    await expect(page).toHaveURL('/');
  });
});

async function addProductToCart(page: import('@playwright/test').Page) {
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());

  // Click first product
  await page.getByTestId('product-card').first().click();
  await expect(page).toHaveURL(/\/product\/.+/);
  await page.waitForLoadState('networkidle');

  // Select storage and color
  const storageOptions = page.locator('[role="radiogroup"][aria-label="Select storage"] button');
  await storageOptions.first().click();

  const colorOptions = page.locator('[role="radiogroup"][aria-label="Select color"] button');
  await colorOptions.first().click();

  // Click add button and wait for confirmation
  const addButton = page.getByTestId('add-to-cart-button');
  await addButton.click();
  await expect(addButton).toHaveAttribute('data-added', 'true');
}

test.describe('Cart Page - With Items', () => {
  test.beforeEach(async ({ page }) => {
    await setupApiMocks(page);
    await addProductToCart(page);
  });

  test('should display cart items', async ({ page }) => {
    await page.goto('/cart');

    // Should show cart title
    await expect(page.getByText(/cart/i).first()).toBeVisible();

    // Should show product in cart
    await expect(page.getByTestId('cart-item').first()).toBeVisible();
  });

  test('should display item details', async ({ page }) => {
    await page.goto('/cart');

    const cartItem = page.getByTestId('cart-item').first();

    // Should have image
    await expect(cartItem.locator('img')).toBeVisible();

    // Should have cart item name
    await expect(page.getByTestId('cart-item-name')).toBeVisible();
  });

  test('should display cart footer with total', async ({ page }) => {
    await page.goto('/cart');

    // Should show total
    await expect(page.getByText(/total/i)).toBeVisible();
    await expect(page.getByText(/EUR/).first()).toBeVisible();
  });

  test('should remove item from cart', async ({ page }) => {
    await page.goto('/cart');

    // Find and click remove button
    await page.getByTestId('remove-from-cart-button').click();

    // Cart should now be empty
    await expect(page.getByTestId('empty-cart')).toBeVisible();
  });

  test('should have continue shopping button', async ({ page }) => {
    await page.goto('/cart');

    const continueButton = page.getByRole('link', { name: /continue shopping/i });
    await expect(continueButton).toBeVisible();

    // Scroll into view and use JavaScript click for reliable cross-browser behavior
    await continueButton.scrollIntoViewIfNeeded();
    await continueButton.evaluate((el: HTMLElement) => el.click());
    await expect(page).toHaveURL('/');
  });

  test('should have pay button', async ({ page }) => {
    await page.goto('/cart');

    await expect(page.getByRole('button', { name: /pay/i })).toBeVisible();
  });
});

test.describe('Cart Persistence', () => {
  test.beforeEach(async ({ page }) => {
    await setupApiMocks(page);
  });

  test('should persist cart after page refresh', async ({ page }) => {
    await addProductToCart(page);

    await page.reload();

    // Go to cart and verify item is there
    await page.goto('/cart');
    await expect(page.getByText(/cart/i).first()).toBeVisible();
    await expect(page.getByTestId('cart-item').first()).toBeVisible();
  });

  test('should persist cart across navigation', async ({ page }) => {
    await addProductToCart(page);

    // Navigate to home
    await page.getByRole('link', { name: /back/i }).click();
    await expect(page).toHaveURL('/');

    // Navigate to cart
    await page.goto('/cart');

    // Cart should have item
    await expect(page.getByText(/cart/i).first()).toBeVisible();
    await expect(page.getByTestId('cart-item').first()).toBeVisible();
  });
});

test.describe('Cart - Multiple Items', () => {
  test.beforeEach(async ({ page }) => {
    await setupApiMocks(page);
  });

  test('should handle multiple different products', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());

    // Add first product
    await page.getByTestId('product-card').first().click();
    await expect(page).toHaveURL(/\/product\/.+/);
    await page.waitForLoadState('networkidle');

    // Select options
    const storageOptions = page.locator('[role="radiogroup"][aria-label="Select storage"] button');
    await storageOptions.first().click();

    const colorOptions = page.locator('[role="radiogroup"][aria-label="Select color"] button');
    await colorOptions.first().click();

    let addButton = page.getByTestId('add-to-cart-button');
    await addButton.click();
    await expect(addButton).toHaveAttribute('data-added', 'true');

    // Wait for button to reset
    await expect(addButton).toHaveAttribute('data-added', 'false', { timeout: 3000 });

    // Go back and add second product
    await page.getByRole('link', { name: /back/i }).click();
    await expect(page).toHaveURL('/');

    await page.getByTestId('product-card').nth(1).click();
    await expect(page).toHaveURL(/\/product\/.+/);
    await page.waitForLoadState('networkidle');

    // Select options for second product
    const storageOptions2 = page.locator('[role="radiogroup"][aria-label="Select storage"] button');
    await storageOptions2.first().click();

    const colorOptions2 = page.locator('[role="radiogroup"][aria-label="Select color"] button');
    await colorOptions2.first().click();

    addButton = page.getByTestId('add-to-cart-button');
    await addButton.click();
    await expect(addButton).toHaveAttribute('data-added', 'true');

    // Go to cart
    await page.goto('/cart');

    // Should show 2 items in cart badge
    await expect(page.getByTestId('cart-badge')).toHaveAttribute('data-count', '2');
  });

  test('should update count when removing items', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());

    // Add first product
    await page.getByTestId('product-card').first().click();
    await expect(page).toHaveURL(/\/product\/.+/);
    await page.waitForLoadState('networkidle');

    const storageOptions = page.locator('[role="radiogroup"][aria-label="Select storage"] button');
    await storageOptions.first().click();

    const colorOptions = page.locator('[role="radiogroup"][aria-label="Select color"] button');
    await colorOptions.first().click();

    let addButton = page.getByTestId('add-to-cart-button');
    await addButton.click();
    await expect(addButton).toHaveAttribute('data-added', 'true');

    // Wait for button to reset
    await expect(addButton).toHaveAttribute('data-added', 'false', { timeout: 3000 });

    // Go back
    await page.getByRole('link', { name: /back/i }).click();
    await expect(page).toHaveURL('/');

    // Add second product
    await page.getByTestId('product-card').nth(1).click();
    await expect(page).toHaveURL(/\/product\/.+/);
    await page.waitForLoadState('networkidle');

    const storageOptions2 = page.locator('[role="radiogroup"][aria-label="Select storage"] button');
    await storageOptions2.first().click();

    const colorOptions2 = page.locator('[role="radiogroup"][aria-label="Select color"] button');
    await colorOptions2.first().click();

    addButton = page.getByTestId('add-to-cart-button');
    await addButton.click();
    await expect(addButton).toHaveAttribute('data-added', 'true');

    await page.goto('/cart');

    // Verify 2 items in cart
    const cartItems = page.getByTestId('cart-item');
    await expect(cartItems).toHaveCount(2);

    // Remove first item
    await page.getByTestId('remove-from-cart-button').first().click();

    // Should now show 1 item
    await expect(cartItems).toHaveCount(1);
  });
});
