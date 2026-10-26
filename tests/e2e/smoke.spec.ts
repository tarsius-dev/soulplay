/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { test, expect } from '@playwright/test';

test.describe('SeoulPlay Smoke Test Suite', () => {
  test('homepage loads with brand wordmark and hero banner', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/SeoulPlay/);
    const heroHeadline = page.locator('h1');
    await expect(heroHeadline).toBeVisible();
  });

  test('search returns expected demo data', async ({ page }) => {
    await page.goto('/search?q=Chaebol');
    await expect(page.locator('text=Queen of the Chaebol')).toBeVisible();
  });

  test('detail page displays metadata and episode guide', async ({ page }) => {
    await page.goto('/title/queen-of-the-chaebol');
    await expect(page.locator('h1')).toContainText('Queen of the Chaebol');
    await expect(page.locator('text=Synopsis')).toBeVisible();
    await expect(page.locator('text=Episode 1: The Golden Tower')).toBeVisible();
  });

  test('unavailable video displays safe fallback placeholder', async ({ page }) => {
    // Episode 2 has no confirmed authorized source
    await page.goto('/title/queen-of-the-chaebol/watch/episode-2');
    await expect(page.locator('text=Authorized Video Stream Unavailable')).toBeVisible();
  });

  test('admin routes redirect unauthenticated users to login', async ({ page }) => {
    await page.goto('/admin');
    await expect(page).toHaveURL(/.*admin\/login/);
    await expect(page.locator('text=SeoulPlay Administration')).toBeVisible();
  });
});
