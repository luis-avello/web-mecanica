## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Project Overview

Single-page website for "Mecánica Avello SPA" — mechanic workshop specializing in 4x4, SUV, and pickup trucks.

- **Framework**: Astro v7.1.6 + Tailwind CSS v4 (via `@tailwindcss/vite`)
- **Design**: Dark theme (#0A0A0A bg, #E31E24 red accent, white text)
- **Sections**: inicio, quienes-somos, servicios, productos, proyectos, videos, ubicación, contacto
- **Content**: Externalized to JSON/MD files in `src/content/`
- **Assets**: Images in `public/assets/` for direct URL access
- **YouTube**: https://www.youtube.com/@mecanicaavello4x4
- **WhatsApp**: +569 7213 5168 → https://wa.me/56972135168
- **Instagram**: @mecanicaavello
- **Email**: mecanica.avello@gmail.com
- **Address**: Camino a Melipilla 2000, Bodega 2, Padre Hurtado, Santiago, Chile

## Important Technical Rules

### Client-side Scripts in Astro

1. **Never use template literals (`${}`) in `<script client:load>`** — Astro's parser interprets `${}` as expressions. Use string concatenation instead:
   ```js
   // WRONG: mainImage.alt = `Foto ${index + 1}`;
   // CORRECT: mainImage.alt = 'Foto ' + (index + 1);
   ```

2. **Use `client:load`** for interactive components that need immediate client-side JS.

3. **Wrap all `client:load` scripts in an IIFE** to avoid global scope collisions between components:
   ```astro
   <script client:load>
   (function() {
     const section = document.getElementById('...');
     // ... all logic inside the IIFE
   })();
   </script>
   ```

4. **For state toggles**, use `data-*` attributes on parent elements + CSS attribute selectors instead of class manipulation:
   ```html
   <header data-menu-open="false">...</header>
   <div id="mobile-menu">...</div>
   ```
   ```css
   #mobile-menu { transform: translateX(100%); }
   header[data-menu-open="true"] ~ #mobile-menu { transform: translateX(0); }
   ```

5. **For mobile menus**, position the menu OUTSIDE the `<header>` element and use sibling selector (`~`) in CSS. Set `z-[9999]` to ensure it's above all content.

6. **For swipe/drag gestures**, use `mousedown`/`mouseup` on the element and `touchstart`/`touchend` on the element, but listen for `mouseup`/`touchend` on `window` so releases outside the element still register.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
