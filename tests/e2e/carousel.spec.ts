import { test, expect } from '@playwright/test';

test.describe('Carousel — Quienes Somos', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.locator('#quienes-somos').scrollIntoViewIfNeeded();
  });

  test('main image es visible', async ({ page }) => {
    const mainImage = page.locator('#quienes-somos [data-gallery] img');
    await expect(mainImage).toBeVisible();
    await expect(mainImage).toHaveAttribute('alt', 'Mecánica Avello - Foto 1');
  });

  test('dots son visibles y tienen count correcto', async ({ page }) => {
    const dots = page.locator('#quienes-somos [data-gallery] .gallery-dots button');
    await expect(dots).toHaveCount(5);
  });

  test('primer dot tiene estado activo', async ({ page }) => {
    const activeDot = page.locator('#quienes-somos [data-gallery] .gallery-dots button.bg-red');
    await expect(activeDot).toBeVisible();
  });

  test('click en dot cambia imagen', async ({ page }) => {
    const mainImage = page.locator('#quienes-somos [data-gallery] img');
    const dots = page.locator('#quienes-somos [data-gallery] .gallery-dots button');

    const initialSrc = await mainImage.getAttribute('src');

    await dots.nth(2).click();

    const newSrc = await mainImage.getAttribute('src');
    expect(newSrc).not.toBe(initialSrc);
  });

  test('alt text se actualiza al cambiar imagen', async ({ page }) => {
    const mainImage = page.locator('#quienes-somos [data-gallery] img');
    const dots = page.locator('#quienes-somos [data-gallery] .gallery-dots button');

    await dots.nth(3).click();

    await expect(mainImage).toHaveAttribute('alt', 'Mecánica Avello - Foto 4');
  });

  test('dot activo se actualiza', async ({ page }) => {
    const dots = page.locator('#quienes-somos [data-gallery] .gallery-dots button');

    await dots.nth(4).click();

    const activeDots = page.locator('#quienes-somos [data-gallery] .gallery-dots button.bg-red');
    await expect(activeDots).toHaveCount(1);
    await expect(activeDots.first()).toHaveAttribute('data-index', '4');
  });

  test('botones prev/next son visibles y tienen aria-label', async ({ page }) => {
    const prev = page.locator('#quienes-somos [data-gallery] [data-nav="prev"]');
    const next = page.locator('#quienes-somos [data-gallery] [data-nav="next"]');
    await expect(prev).toBeVisible();
    await expect(next).toBeVisible();
    await expect(prev).toHaveAttribute('aria-label', 'Imagen anterior');
    await expect(next).toHaveAttribute('aria-label', 'Imagen siguiente');
  });

  test('next avanza y prev retrocede', async ({ page }) => {
    const mainImage = page.locator('#quienes-somos [data-gallery] img');
    const prev = page.locator('#quienes-somos [data-gallery] [data-nav="prev"]');
    const next = page.locator('#quienes-somos [data-gallery] [data-nav="next"]');

    const initialSrc = await mainImage.getAttribute('src');

    await next.click();
    const nextSrc = await mainImage.getAttribute('src');
    expect(nextSrc).not.toBe(initialSrc);

    await prev.click();
    const backSrc = await mainImage.getAttribute('src');
    expect(backSrc).toBe(initialSrc);
  });

  test('next hace wrap-around desde la última imagen', async ({ page }) => {
    const mainImage = page.locator('#quienes-somos [data-gallery] img');
    const dots = page.locator('#quienes-somos [data-gallery] .gallery-dots button');
    const next = page.locator('#quienes-somos [data-gallery] [data-nav="next"]');

    await dots.last().click();

    await next.click();

    await expect(mainImage).toHaveAttribute('alt', 'Mecánica Avello - Foto 1');
  });

  test('prev hace wrap-around desde la primera imagen', async ({ page }) => {
    const mainImage = page.locator('#quienes-somos [data-gallery] img');
    const prev = page.locator('#quienes-somos [data-gallery] [data-nav="prev"]');

    await prev.click();

    await expect(mainImage).toHaveAttribute('alt', 'Mecánica Avello - Foto 5');
  });

  test('drag/swipe hacia la derecha muestra la imagen anterior', async ({ page }) => {
    const mainImage = page.locator('#quienes-somos [data-gallery] img');
    const dots = page.locator('#quienes-somos [data-gallery] .gallery-dots button');

    // Ir a la última imagen primero para poder retroceder
    await dots.last().click();
    const initialSrc = await mainImage.getAttribute('src');

    const box = await mainImage.boundingBox();
    if (box) {
      await page.mouse.move(box.x + box.width * 0.3, box.y + box.height / 2);
      await page.mouse.down();
      await page.mouse.move(box.x + box.width * 0.8, box.y + box.height / 2, { steps: 10 });
      await page.mouse.up();
    }

    const newSrc = await mainImage.getAttribute('src');
    expect(newSrc).not.toBe(initialSrc);
  });

  test('drag/swipe hacia la izquierda muestra la imagen siguiente', async ({ page }) => {
    const mainImage = page.locator('#quienes-somos [data-gallery] img');
    const initialSrc = await mainImage.getAttribute('src');

    const box = await mainImage.boundingBox();
    if (box) {
      await page.mouse.move(box.x + box.width * 0.7, box.y + box.height / 2);
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
    const mainImage = page.locator('#proyectos [data-gallery] img');
    await expect(mainImage).toBeVisible();
    await expect(mainImage).toHaveAttribute('alt', 'Proyecto 1');
  });

  test('dots tienen count igual a galleryImages', async ({ page }) => {
    const dots = page.locator('#proyectos [data-gallery] .gallery-dots button');
    await expect(dots).toHaveCount(5);
  });

  test('click en dot cambia imagen', async ({ page }) => {
    const mainImage = page.locator('#proyectos [data-gallery] img');
    const dots = page.locator('#proyectos [data-gallery] .gallery-dots button');

    const initialSrc = await mainImage.getAttribute('src');

    await dots.nth(1).click();

    const newSrc = await mainImage.getAttribute('src');
    expect(newSrc).not.toBe(initialSrc);
  });

  test('alt text se actualiza al cambiar imagen', async ({ page }) => {
    const mainImage = page.locator('#proyectos [data-gallery] img');
    const dots = page.locator('#proyectos [data-gallery] .gallery-dots button');

    await dots.nth(2).click();

    await expect(mainImage).toHaveAttribute('alt', 'Proyecto 3');
  });

  test('botones prev/next hacen wrap-around', async ({ page }) => {
    const mainImage = page.locator('#proyectos [data-gallery] img');
    const prev = page.locator('#proyectos [data-gallery] [data-nav="prev"]');
    const next = page.locator('#proyectos [data-gallery] [data-nav="next"]');

    // Desde la primera, prev va a la última
    await prev.click();
    await expect(mainImage).toHaveAttribute('alt', 'Proyecto 5');

    // Desde la última, next vuelve a la primera
    await next.click();
    await expect(mainImage).toHaveAttribute('alt', 'Proyecto 1');
  });

  test('drag/swipe cambia imagen', async ({ page }) => {
    const mainImage = page.locator('#proyectos [data-gallery] img');
    const initialSrc = await mainImage.getAttribute('src');

    const box = await mainImage.boundingBox();
    if (box) {
      // Arrastrar hacia la izquierda muestra la imagen siguiente
      await page.mouse.move(box.x + box.width * 0.7, box.y + box.height / 2);
      await page.mouse.down();
      await page.mouse.move(box.x + box.width * 0.2, box.y + box.height / 2, { steps: 10 });
      await page.mouse.up();
    }

    const newSrc = await mainImage.getAttribute('src');
    expect(newSrc).not.toBe(initialSrc);
  });
});
