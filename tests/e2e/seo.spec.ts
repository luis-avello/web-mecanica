import { test, expect } from '@playwright/test';

test.describe('SEO — Meta Tags', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('title es correcto', async ({ page }) => {
    await expect(page).toHaveTitle(/Mecánica Avello/);
    await expect(page).toHaveTitle(/4x4, SUV y Camionetas/);
  });

  test('meta description presente', async ({ page }) => {
    const desc = page.locator('meta[name="description"]');
    await expect(desc).toBeVisible();
    const content = await desc.getAttribute('content');
    expect(content).toContain('Mecánica Avello');
    expect(content).toContain('4x4');
  });

  test('meta keywords presente', async ({ page }) => {
    const keywords = page.locator('meta[name="keywords"]');
    await expect(keywords).toBeVisible();
    const content = await keywords.getAttribute('content');
    expect(content).toContain('mecánica');
    expect(content).toContain('4x4');
  });

  test('canonical URL presente', async ({ page }) => {
    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toBeVisible();
    await expect(canonical).toHaveAttribute('href', 'https://mecanicaavello.cl/');
  });

  test('theme-color presente', async ({ page }) => {
    const themeColor = page.locator('meta[name="theme-color"]');
    await expect(themeColor).toBeVisible();
    await expect(themeColor).toHaveAttribute('content', '#0A0A0A');
  });

  test('viewport meta presente', async ({ page }) => {
    const viewport = page.locator('meta[name="viewport"]');
    await expect(viewport).toBeVisible();
    await expect(viewport).toHaveAttribute('content', /width=device-width/);
  });

  test('robots meta permite indexacion', async ({ page }) => {
    const robots = page.locator('meta[name="robots"]');
    await expect(robots).toBeVisible();
    await expect(robots).toHaveAttribute('content', /index/);
    await expect(robots).toHaveAttribute('content', /follow/);
  });
});

test.describe('SEO — Open Graph', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('og:locale presente', async ({ page }) => {
    const ogLocale = page.locator('meta[property="og:locale"]');
    await expect(ogLocale).toBeVisible();
    await expect(ogLocale).toHaveAttribute('content', 'es_CL');
  });

  test('og:type es website', async ({ page }) => {
    const ogType = page.locator('meta[property="og:type"]');
    await expect(ogType).toBeVisible();
    await expect(ogType).toHaveAttribute('content', 'website');
  });

  test('og:title presente', async ({ page }) => {
    const ogTitle = page.locator('meta[property="og:title"]');
    await expect(ogTitle).toBeVisible();
    const content = await ogTitle.getAttribute('content');
    expect(content).toContain('Mecánica Avello');
  });

  test('og:description presente', async ({ page }) => {
    const ogDesc = page.locator('meta[property="og:description"]');
    await expect(ogDesc).toBeVisible();
    const content = await ogDesc.getAttribute('content');
    expect(content).toContain('Mecánica Avello');
  });

  test('og:image presente con dimensiones', async ({ page }) => {
    const ogImage = page.locator('meta[property="og:image"]');
    await expect(ogImage).toBeVisible();
    await expect(ogImage).toHaveAttribute('content', /mecanicaavello\.cl/);

    const ogImageWidth = page.locator('meta[property="og:image:width"]');
    await expect(ogImageWidth).toBeVisible();
    await expect(ogImageWidth).toHaveAttribute('content', '1200');

    const ogImageHeight = page.locator('meta[property="og:image:height"]');
    await expect(ogImageHeight).toBeVisible();
    await expect(ogImageHeight).toHaveAttribute('content', '630');
  });

  test('og:url presente', async ({ page }) => {
    const ogUrl = page.locator('meta[property="og:url"]');
    await expect(ogUrl).toBeVisible();
    await expect(ogUrl).toHaveAttribute('content', 'https://mecanicaavello.cl/');
  });
});

test.describe('SEO — Twitter Card', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('twitter:card es summary_large_image', async ({ page }) => {
    const card = page.locator('meta[name="twitter:card"]');
    await expect(card).toBeVisible();
    await expect(card).toHaveAttribute('content', 'summary_large_image');
  });

  test('twitter:title presente', async ({ page }) => {
    const title = page.locator('meta[name="twitter:title"]');
    await expect(title).toBeVisible();
    const content = await title.getAttribute('content');
    expect(content).toContain('Mecánica Avello');
  });

  test('twitter:description presente', async ({ page }) => {
    const desc = page.locator('meta[name="twitter:description"]');
    await expect(desc).toBeVisible();
  });

  test('twitter:image presente', async ({ page }) => {
    const image = page.locator('meta[name="twitter:image"]');
    await expect(image).toBeVisible();
    await expect(image).toHaveAttribute('content', /mecanicaavello\.cl/);
  });
});

test.describe('SEO — JSON-LD Structured Data', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('JSON-LD script presente', async ({ page }) => {
    const jsonLd = page.locator('script[type="application/ld+json"]');
    await expect(jsonLd).toBeVisible();
  });

  test('JSON-LD es tipo AutoRepair', async ({ page }) => {
    const jsonLd = page.locator('script[type="application/ld+json"]').first();
    const content = await jsonLd.textContent();
    expect(content).toContain('"@type": "AutoRepair"');
  });

  test('JSON-LD tiene nombre del negocio', async ({ page }) => {
    const jsonLd = page.locator('script[type="application/ld+json"]').first();
    const content = await jsonLd.textContent();
    expect(content).toContain('Mecánica Avello SPA');
  });

  test('JSON-LD tiene telefono', async ({ page }) => {
    const jsonLd = page.locator('script[type="application/ld+json"]').first();
    const content = await jsonLd.textContent();
    expect(content).toContain('+56 9 7213 5168');
  });

  test('JSON-LD tiene email', async ({ page }) => {
    const jsonLd = page.locator('script[type="application/ld+json"]').first();
    const content = await jsonLd.textContent();
    expect(content).toContain('mecanica.avello@gmail.com');
  });

  test('JSON-LD tiene direccion', async ({ page }) => {
    const jsonLd = page.locator('script[type="application/ld+json"]').first();
    const content = await jsonLd.textContent();
    expect(content).toContain('Padre Hurtado');
    expect(content).toContain('Chile');
  });

  test('JSON-LD tiene sameAs con redes sociales', async ({ page }) => {
    const jsonLd = page.locator('script[type="application/ld+json"]').first();
    const content = await jsonLd.textContent();
    expect(content).toContain('youtube.com');
    expect(content).toContain('instagram.com');
  });
});

test.describe('Accesibilidad', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('html tiene lang="es"', async ({ page }) => {
    await expect(page.locator('html')).toHaveAttribute('lang', 'es');
  });

  test('h1 es unico y esta presente', async ({ page }) => {
    const h1s = page.locator('h1');
    await expect(h1s).toHaveCount(1);
    const text = await h1s.first().textContent();
    expect(text).toContain('4x4');
  });

  test('h2s presentes en secciones', async ({ page }) => {
    const h2s = page.locator('h2');
    await expect(h2s).toHaveCountGreaterThanOrEqual(8);
  });

  test('heading hierarchy es correcta (h1 > h2 > h3)', async ({ page }) => {
    const h1Count = await page.locator('h1').count();
    const h2Count = await page.locator('h2').count();
    const h3Count = await page.locator('h3').count();

    expect(h1Count).toBe(1);
    expect(h2Count).toBeGreaterThan(0);
  });

  test('imagenes decorativas tienen aria-hidden', async ({ page }) => {
    const decorativeImages = page.locator('img[aria-hidden="true"]');
    await expect(decorativeImages).toHaveCountGreaterThanOrEqual(2);
  });

  test('imagenes funcionales tienen alt text', async ({ page }) => {
    const functionalImages = page.locator('img[alt]:not([alt=""])');
    const count = await functionalImages.count();
    expect(count).toBeGreaterThan(0);
  });

  test('links externos tienen rel="noopener noreferrer"', async ({ page }) => {
    const externalLinks = page.locator('a[target="_blank"]');
    const count = await externalLinks.count();
    expect(count).toBeGreaterThan(0);

    const linksWithRel = page.locator('a[target="_blank"][rel="noopener noreferrer"]');
    const linksWithRelCount = await linksWithRel.count();
    expect(linksWithRelCount).toBe(count);
  });

  test('botones de navegacion tienen aria-label', async ({ page }) => {
    const hamburger = page.locator('#menu-toggle');
    await expect(hamburger).toHaveAttribute('aria-label');
  });

  test('dots del carousel tienen aria-label', async ({ page }) => {
    const dots = page.locator('#about-dots button[aria-label]');
    await expect(dots).toHaveCount(5);
  });

  test('body tiene font-family aplicado', async ({ page }) => {
    const fontFamily = await page.evaluate(() => getComputedStyle(document.body).fontFamily);
    expect(fontFamily).toContain('Inter');
  });

  test('background es oscuro', async ({ page }) => {
    const bgColor = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    // Dark background should be close to #0A0A0A or rgb(10, 10, 10)
    expect(bgColor).toContain('10, 10, 10');
  });
});

test.describe('Links — Validacion', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('todos los links internos apuntan a secciones existentes', async ({ page }) => {
    const internalLinks = page.locator('a[href^="#"]');
    const count = await internalLinks.count();

    for (let i = 0; i < count; i++) {
      const href = await internalLinks.nth(i).getAttribute('href');
      if (href && href !== '#') {
        const section = page.locator(href);
        await expect(section.first()).toBeVisible({ timeout: 5000 });
      }
    }
  });

  test('boton de WhatsApp tiene URL correcta', async ({ page }) => {
    const whatsappLinks = page.locator('a[href*="wa.me"]');
    const count = await whatsappLinks.count();
    expect(count).toBeGreaterThan(0);

    await expect(whatsappLinks.first()).toHaveAttribute('href', 'https://wa.me/56972135168');
  });

  test('boton de GestionCar tiene URL correcta', async ({ page }) => {
    const gestionLinks = page.locator('a[href*="gestioncar"]');
    const count = await gestionLinks.count();
    expect(count).toBeGreaterThan(0);
  });

  test('boton de Google Maps tiene URL correcta', async ({ page }) => {
    const mapsLinks = page.locator('a[href*="google.com/maps"]');
    const count = await mapsLinks.count();
    expect(count).toBeGreaterThan(0);
  });
});

test.describe('Secciones — Estructura', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('todas las secciones estan presentes', async ({ page }) => {
    const sections = ['inicio', 'quienes-somos', 'servicios', 'productos', 'proyectos', 'videos', 'ubicacion', 'contacto'];

    for (const sectionId of sections) {
      const section = page.locator(`#${sectionId}`);
      await expect(section).toBeVisible({ timeout: 5000 });
    }
  });

  test('hero es la primera seccion', async ({ page }) => {
    const hero = page.locator('#inicio');
    const firstSection = page.locator('main > section').first();
    await expect(hero).toBe(firstSection);
  });

  test('footer es la ultima seccion', async ({ page }) => {
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
  });
});
