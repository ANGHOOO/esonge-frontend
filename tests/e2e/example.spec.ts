import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('should display the homepage correctly', async ({ page }) => {
    await page.goto('/');

    // Check if the main heading is visible
    await expect(page.getByRole('heading', { name: /Esonge Shopping Mall/i })).toBeVisible();

    // Check if setup completion message is visible
    await expect(page.getByText(/환경 설정이 완료되었습니다/i)).toBeVisible();
  });

  test('should have correct page title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Esonge Shopping Mall/i);
  });
});
