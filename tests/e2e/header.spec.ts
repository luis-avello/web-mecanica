import { test, expect } from '@playwright/test';

test.describe('Header', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test.describe('estructura desktop', () => {
    test('logo esta presente y tiene alt text', async ({ page }) => {
      const logo = page.locator('header img[alt="Mecánica Avello"]');
      await expect(logo).toBeVisible();
    });

    test('nav desktop tiene 8 links', async ({ page }) => {
      const navLinks = page.locator('nav.hidden a');
      await expect(navLinks).toHaveCount(8);
    });

    test('nav links apuntan a secciones correctas', async ({ page }) => {
      const navLinks = page.locator('nav.hidden a');
      const expectedIds = [
        '#inicio',
        '#quienes-somos',
        '#servicios',
        '#productos',
        '#proyectos',
        '#videos',
        '#ubicacion',
        '#contacto'
      ];

      for (let i = 0; i < navLinks.count(); i++) {
        const href = await navLinks.nth(i).getAttribute('href');
        expect(href).toBe(expectedIds[i]);
      }
    });

    test('boton WhatsApp en nav desktop', async ({ page }) => {
      const whatsappBtn = page.locator('nav.hidden a:has-text("5168")');
      await expect(whatsappBtn).toBeVisible();
      await expect(whatsappBtn).toHaveAttribute('href', 'https://wa.me/56972135168');
      await expect(whatsappBtn).toHaveAttribute('target', '_blank');
      await expect(whatsappBtn).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });

  test.describe('menu mobile', () => {
    test.use({ viewport: { width: 375, height: 667 } });

    test('hamburger button es visible en mobile', async ({ page }) => {
      const hamburger = page.locator('#menu-toggle');
      await expect(hamburger).toBeVisible();
      await expect(hamburger).toHaveAttribute('aria-label', 'Toggle menu');
    });

    test('menu mobile se abre al hacer click en hamburger', async ({ page }) => {
      const hamburger = page.locator('#menu-toggle');
      const mobileMenu = page.locator('#mobile-menu');

      await expect(mobileMenu).not.toBeVisible();

      await hamburger.click();

      await expect(mobileMenu).toBeVisible();
      await expect(page.locator('#header')).toHaveAttribute('data-menu-open', 'true');
    });

    test('menu mobile se cierra al hacer click en un link', async ({ page }) => {
      const hamburger = page.locator('#menu-toggle');
      const mobileMenu = page.locator('#mobile-menu');

      await hamburger.click();
      await expect(mobileMenu).toBeVisible();

      const firstLink = page.locator('.mobile-nav-link').first();
      await firstLink.click();

      await expect(mobileMenu).not.toBeVisible();
      await expect(page.locator('#header')).toHaveAttribute('data-menu-open', 'false');
    });

    test('body overflow se bloquea cuando menu esta abierto', async ({ page }) => {
      const hamburger = page.locator('#menu-toggle');
      await hamburger.click();

      const overflow = await page.evaluate(() => document.body.style.overflow);
      expect(overflow).toBe('hidden');
    });

    test('menu mobile tiene todos los links de navegacion', async ({ page }) => {
      const hamburger = page.locator('#menu-toggle');
      await hamburger.click();

      const mobileLinks = page.locator('.mobile-nav-link');
      await expect(mobileLinks).toHaveCount(8);
    });

    test('menu mobile tiene boton WhatsApp', async ({ page }) => {
      const hamburger = page.locator('#menu-toggle');
      await hamburger.click();

      const whatsappBtn = page.locator('#mobile-menu a:has-text("5168")');
      await expect(whatsappBtn).toBeVisible();
      await expect(whatsappBtn).toHaveAttribute('href', 'https://wa.me/56972135168');
    });
  });

  test.describe('efecto scroll', () => {
    test('header gana classe scrolled al hacer scroll > 50px', async ({ page }) => {
      const header = page.locator('#header');
      await expect(header).nottoHaveClass(/scrolled/);

      await page.evaluate(() => window.scrollTo(0, 100));
      await expect(header).toHaveClass(/scrolled/);
    });

    test('header pierde classe scrolled al volver arriba', async ({ page }) => {
      await page.evaluate(() => window.scrollTo(0, 100));
      const header = page.locator('#header');
      await expect(header).toHaveClass(/scrolled/);

      await page.evaluate(() => window.scrollTo(0, 0));
      await expect(header).not.toHaveClass(/scrolled/);
    });
  });

  test.describe('accesibilidad', () => {
    test('hamburger tiene aria-label', async ({ page }) => {
      const hamburger = page.locator('#menu-toggle');
      await expect(hamburger).toHaveAttribute('aria-label', 'Toggle menu');
    });

    test('logo es un link con href', async ({ page }) => {
      const logoLink = page.locator('header a:has(img)').first();
      await expect(logoLink).toHaveAttribute('href', '#inicio');
    });
  });
});
