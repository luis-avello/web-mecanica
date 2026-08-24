import { test, expect } from '@playwright/test';

test.describe('Carousel — Quienes Somos', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.locator('#quienes-somos').scrollIntoViewIfNeeded();
  });

  test('main image es visible', async ({ page }) => {
    const mainImage = page.locator('#about-main-image');
    await expect(mainImage).toBeVisible();
    await expect(mainImage).toHaveAttribute('alt', 'Mecánica Avello - Foto 1');
  });

  test('dots son visibles y tienen count correcto', async ({ page }) => {
    const dots = page.locator('#about-dots button');
    await expect(dots).toHaveCount(5);
  });

  test('primer dot tiene estado activo', async ({ page }) => {
    const activeDot = page.locator('#about-dots button.bg-red');
    await expect(activeDot).toBeVisible();
  });

  test('click en dot cambia imagen', async ({ page }) => {
    const mainImage = page.locator('#about-main-image');
    const dots = page.locator('#about-dots button');

    const initialSrc = await mainImage.getAttribute('src');

    await dots.nth(2).click();

    const newSrc = await mainImage.getAttribute('src');
    expect(newSrc).not.toBe(initialSrc);
  });

  test('alt text se actualiza al cambiar imagen', async ({ page }) => {
    const mainImage = page.locator('#about-main-image');
    const dots = page.locator('#about-dots button');

    await dots.nth(3).click();

    await expect(mainImage).toHaveAttribute('alt', 'Mecánica Avello - Foto 4');
  });

  test('dot activo se actualiza', async ({ page }) => {
    const dots = page.locator('#about-dots button');

    await dots.nth(4).click();

    const activeDots = dots.filter({ hasClass: 'bg-red' });
    await expect(activeDots).toHaveCount(1);
    await expect(activeDots.first()).toHaveAttribute('data-index', '4');
  });

  test('drag/swipe cambia imagen hacia la derecha', async ({ page }) => {
    const mainImage = page.locator('#about-main-image');
    const initialSrc = await mainImage.getAttribute('src');

    const box = await mainImage.boundingBox();
    if (box) {
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await page.mouse.down();
      await page.mouse.move(box.x + box.width * 0.8, box.y + box.height / 2, { steps: 10 });
      await page.mouse.up();
    }

    const newSrc = await mainImage.getAttribute('src');
    expect(newSrc).not.toBe(initialSrc);
  });

  test('drag/swipe cambia imagen hacia la izquierda', async ({ page }) => {
    const mainImage = page.locator('#about-main-image');
    const dots = page.locator('#about-dots button');

    // Ir a la ultima imagen primero
    await dots.last().click();

    const initialSrc = await mainImage.getAttribute('src');

    const box = await mainImage.boundingBox();
    if (box) {
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await page.mouse.down();
      await page.mouse.move(box.x + box.width * 0.2, box.y + box.height / 2, { steps: 10 });
      await page.mouse.up();
    }

    const newSrc = await mainImage.getAttribute('src');
    expect(newSrc).not.toBe(initialSrc);
  });
});

test.describe('Carousel — Proyectos', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.locator('#proyectos').scrollIntoViewIfNeeded();
  });

  test('main image es visible', async ({ page }) => {
    const mainImage = page.locator('#projects-main-image');
    await expect(mainImage).toBeVisible();
    await expect(mainImage).toHaveAttribute('alt', 'Proyecto 1');
  });

  test('dots tienen count igual a galleryImages', async ({ page }) => {
    const dots = page.locator('#projects-dots button');
    await expect(dots).toHaveCount(5);
  });

  test('click en dot cambia imagen', async ({ page }) => {
    const mainImage = page.locator('#projects-main-image');
    const dots = page.locator('#projects-dots button');

    const initialSrc = await mainImage.getAttribute('src');

    await dots.nth(1).click();

    const newSrc = await mainImage.getAttribute('src');
    expect(newSrc).not.toBe(initialSrc);
  });

  test('alt text se actualiza al cambiar imagen', async ({ page }) => {
    const mainImage = page.locator('#projects-main-image');
    const dots = page.locator('#projects-dots button');

    await dots.nth(2).click();

    await expect(mainImage).toHaveAttribute('alt', 'Proyecto 3');
  });

  test('drag/swipe cambia imagen', async ({ page }) => {
    const mainImage = page.locator('#projects-main-image');
    const initialSrc = await mainImage.getAttribute('src');

    const box = await mainImage.boundingBox();
    if (box) {
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await page.mouse.down();
      await page.mouse.move(box.x + box.width * 0.8, box.y + box.height / 2, { steps: 10 });
      await page.mouse.up();
    }

    const newSrc = await mainImage.getAttribute('src');
    expect(newSrc).not.toBe(initialSrc);
  });
});
