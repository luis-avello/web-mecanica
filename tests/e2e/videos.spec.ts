import { test, expect } from '@playwright/test';

test.describe('Videos — Lazy Loading', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.locator('#videos').scrollIntoViewIfNeeded();
  });

  test('main video thumbnail es visible', async ({ page }) => {
    const mainLazy = page.locator('.video-lazy').first();
    await expect(mainLazy).toBeVisible();
  });

  test('main video muestra thumbnail de YouTube', async ({ page }) => {
    const mainImg = page.locator('.video-lazy:first-child img');
    await expect(mainImg).toBeVisible();
    await expect(mainImg).toHaveAttribute('src', /i\.ytimg\.com\/vi\/yEa2v1Cbxd4/);
  });

  test('main video tiene overlay de play button', async ({ page }) => {
    const mainLazy = page.locator('.video-lazy').first();
    const playBtn = mainLazy.locator('svg path[d="M8 5v14l11-7z"]');
    await expect(playBtn).toBeVisible();
  });

  test('thumbnails adicionales son visibles', async ({ page }) => {
    const lazyContainers = page.locator('.video-lazy');
    await expect(lazyContainers).toHaveCount(4);
  });

  test('click en thumbnail crea iframe', async ({ page }) => {
    const mainLazy = page.locator('.video-lazy').first();

    await expect(mainLazy.locator('iframe')).not.toBeVisible();

    await mainLazy.click();

    await expect(mainLazy.locator('iframe')).toBeVisible();
  });

  test('iframe tiene URL de embed correcta', async ({ page }) => {
    const mainLazy = page.locator('.video-lazy').first();
    await mainLazy.click();

    const iframe = mainLazy.locator('iframe');
    await expect(iframe).toBeVisible();
    await expect(iframe).toHaveAttribute('src', /https:\/\/www\.youtube\.com\/embed\/yEa2v1Cbxd4/);
  });

  test('iframe tiene autoplay=1', async ({ page }) => {
    const mainLazy = page.locator('.video-lazy').first();
    await mainLazy.click();

    const iframe = mainLazy.locator('iframe');
    const src = await iframe.getAttribute('src');
    expect(src).toContain('autoplay=1');
  });

  test('iframe tiene rel=0', async ({ page }) => {
    const mainLazy = page.locator('.video-lazy').first();
    await mainLazy.click();

    const iframe = mainLazy.locator('iframe');
    const src = await iframe.getAttribute('src');
    expect(src).toContain('rel=0');
  });

  test('iframe tiene attributes de permissions', async ({ page }) => {
    const mainLazy = page.locator('.video-lazy').first();
    await mainLazy.click();

    const iframe = mainLazy.locator('iframe');
    await expect(iframe).toHaveAttribute('allow', /accelerometer/);
    await expect(iframe).toHaveAttribute('allowfullscreen', '');
  });

  test('iframe tiene title accesible', async ({ page }) => {
    const mainLazy = page.locator('.video-lazy').first();
    await mainLazy.click();

    const iframe = mainLazy.locator('iframe');
    const title = await iframe.getAttribute('title');
    expect(title).toBe('Gas Andes Suzuki 4x4 2016');
  });

  test('click en thumbnail ya cargado no crea otro iframe', async ({ page }) => {
    const mainLazy = page.locator('.video-lazy').first();
    await mainLazy.click();

    await expect(mainLazy.locator('iframe')).toHaveCount(1);

    await mainLazy.click();

    await expect(mainLazy.locator('iframe')).toHaveCount(1);
  });

  test('thumbnails secundarios funcionan igual', async ({ page }) => {
    const lazyContainers = page.locator('.video-lazy');

    await expect(lazyContainers.nth(1).locator('iframe')).not.toBeVisible();

    await lazyContainers.nth(1).click();

    await expect(lazyContainers.nth(1).locator('iframe')).toBeVisible();
  });

  test('boton Ir a YouTube es visible', async ({ page }) => {
    const youtubeLink = page.locator('a:has-text("Ir a YouTube")');
    await expect(youtubeLink).toBeVisible();
    await expect(youtubeLink).toHaveAttribute('href', 'https://www.youtube.com/@mecanicaavello4x4');
    await expect(youtubeLink).toHaveAttribute('target', '_blank');
    await expect(youtubeLink).toHaveAttribute('rel', 'noopener noreferrer');
  });
});
