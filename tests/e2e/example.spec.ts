import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('should display the homepage correctly', async ({ page }) => {
    await page.goto('/');

    // 메인 히어로 제목 확인
    await expect(page.getByRole('heading', { name: /강원도 청정 자연에서/i })).toBeVisible();

    // 히어로 설명 문구 확인
    await expect(page.getByText(/동성유통에서 엄선한 최고 품질/i)).toBeVisible();

    // 쇼핑 시작 버튼 확인
    await expect(page.getByRole('button', { name: /쇼핑 시작하기/i })).toBeVisible();
  });

  test('should have correct page title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Esonge Shopping Mall/i);
  });

  test('should display category section', async ({ page }) => {
    await page.goto('/');

    // 카테고리 섹션 제목 확인
    await expect(page.getByRole('heading', { name: '카테고리' })).toBeVisible();

    // 메인 카테고리 그리드에서 카테고리 링크 확인 (이모지 포함 텍스트로 특정)
    await expect(page.getByRole('link', { name: /🎁 선물용 명품/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /🍄 자연산 송이 가정용/i })).toBeVisible();
  });

  test('should display features section', async ({ page }) => {
    await page.goto('/');

    // 서비스 특징 섹션 확인
    await expect(page.getByText('빠른 배송')).toBeVisible();
    await expect(page.getByText('품질 보장')).toBeVisible();
    await expect(page.getByText('고객 지원')).toBeVisible();
  });

  test('should navigate to products page when clicking shopping button', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('button', { name: /쇼핑 시작하기/i }).click();

    await expect(page).toHaveURL(/\/products/);
  });
});
