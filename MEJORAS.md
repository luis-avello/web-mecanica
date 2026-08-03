# Mejoras del Proyecto — Mecánica Avello SPA

Lista de mejoras identificadas, organizadas por prioridad. Implementar en etapas posteriores.

---

## Críticas (afectan funcionalidad o rendimiento)

### 1. Videos sin lazy loading

**Archivo**: `src/components/Videos.astro` (lineas 23-44)

Los 4 iframes de YouTube se cargan simultaneamente al inicializar la pagina, afectando el LCP y el uso de datos del usuario.

**Solución**: Agregar `loading="lazy"` y `decoding="async"` a todos los iframes. Idealmente, usar un thumbnail clickeable que cargue el iframe solo al hacer click (lazy-load real con placeholder).

---

### 2. Assets duplicados

**Directorios**: `src/assets/` y `public/assets/`

Ambos directorios contienen el mismo contenido. Solo se necesitan en `public/` ya que todas las imagenes se referencian como `/assets/...`.

**Solución**: Eliminar `src/assets/` o mover las imagenes a `public/assets/` y borrar el duplicado.

---

### 3. Iconos duplicados en servicios.json

**Archivo**: `src/content/services.json` (lineas 25-41)

Los items `Cambio Cremallera Dirección`, `Cambio Embrague`, `Cambio Homocinéticas, Tricetas` y `Cambio Crucetas de Cardan` comparten el mismo icono `Icono-5.png`. Parece un error de data.

**Solución**: Buscar o crear iconos individuales para cada servicio. Actualizar `services.json`.

---

### 4. Hero: imagen de fondo sin `loading="lazy"`

**Archivo**: `src/components/Hero.astro` (linea 9)

La imagen de fondo del hero se carga como `<img>` normal sin `loading="lazy"`. Como es la primera imagen visible, puede competir con el LCP.

**Solución**: Considerar usar `<link rel="preload">` para la imagen del hero en el `<head>` en lugar de `<img>`, o mantenerla como esta si es la LCP image. Si se mantiene como `<img>`, considerar `fetchpriority="high"`.

---

## Importantes (mejoran UX, SEO o accesibilidad)

### 6. Google Fonts: `&` sin escapar en HTML

**Archivo**: `src/pages/index.astro` (linea 40)

```html
<!-- ACTUAL -->
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />

<!-- CORREGIDO -->
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&amp;display=swap" rel="stylesheet" />
```

---

### 6. SEO: Falta robots.txt y sitemap

**Archivo**: `astro.config.mjs`

No hay configuracion de SEO. No hay sitemap ni robots.txt.

**Solución**: Agregar `@astrojs/sitemap` integration al config y crear `public/robots.txt`.

---

### 7. Footer: `new Date().getFullYear()` en build time

**Archivo**: `src/components/Footer.astro` (linea 60)

El copyright se calcula en build time, no en runtime. Si el site se build en enero 2026, el footer dira 2026 incluso en 2027.

**Solución**: Usar `set:html` con un componente que calcule la fecha en el cliente, o hardcodear el ano correcto.

---

### 8. Header: Logo con espacio en filename

**Archivo**: `src/components/Header.astro` (linea 21)

`/assets/logo sin fondo.png` tiene espacio en el filename. Funciona pero es frágil y puede causar problemas en algunos servidores/configs.

**Solución**: Renombrar a `logo-sin-fondo.png` en `public/assets/` y `public/assets/inicio/`, actualizar referencias en `Header.astro` y `Footer.astro`.

---

### 9. Hero: imagen decorativa sin `aria-hidden`

**Archivo**: `src/components/Hero.astro` (linea 9)

La imagen de fondo decorativa tiene `alt=""` pero no tiene `aria-hidden="true"` ni `role="presentation"`. Los lectores de pantalla podrian leerla como imagen decorativa sin contexto.

**Solución**: Agregar `aria-hidden="true"` y `role="presentation"` al `<img>`.

---

## Code Quality (limpieza y mantenibilidad)

### 10. Duplicacion masiva: Scripts de carrusel

**Archivos**: `src/components/About.astro` (lineas 51-121) y `src/components/Projects.astro` (lineas 76-146)

El script del carrusel (click en dots + swipe/drag) esta duplicado casi identico (~70 lineas cada uno).

**Solución**: Extraer a un componente reutilizable `Gallery.astro` que reciba `images`, `mainImageId`, `dotsId` como props.

---

### 11. Duplicacion: Services.astro y Products.astro

**Archivos**: `src/components/Services.astro` y `src/components/Products.astro`

Son estructuralmente identicos (mismo grid, mismo hover, mismo CTA). Solo cambian los nombres de props.

**Solución**: Crear un componente `CardGrid.astro` reutilizable que reciba `items`, `title`, `ctaText`, `ctaHref` como props.

---

### 12. Iconos SVG duplicados

Los SVGs de WhatsApp aparecen 3 veces (Header desktop, Header mobile, Hero) con el mismo path de 40+ lineas.

**Archivos**: `src/components/Header.astro` (lineas 40-42, 83-85), `src/components/Hero.astro` (lineas 63-65)

**Solución**: Extraer a un componente `IconWhatsApp.astro` reutilizable. Lo mismo para iconos de telefono, email, Instagram, calendario.

---

### 13. No hay `src/layouts/`

**Archivo**: `src/pages/index.astro`

Todo esta hardcodeado en `index.astro`. Si se agrega una segunda pagina, se duplicaria el `<head>` completo.

**Solución**: Crear `src/layouts/BaseLayout.astro` con el `<head>`, `<Header />`, `<Footer />`.

---

## Menores (pulido y detalles)

### 14. About.astro: `data-images` expone datos internos en el DOM

**Archivo**: `src/components/About.astro` (linea 13)

`JSON.stringify(galleryImages)` se inyecta directamente en el DOM. Si una imagen tiene comillas o caracteres especiales, podria romper el JSON.

**Solución**: Usar `JSON.stringify` con escape seguro, o pasar las imagenes via un `<script type="application/json">` oculto.

---

### 15. Projects.astro: Dots usan `projects.map` en lugar de `galleryImages.map`

**Archivo**: `src/components/Projects.astro` (linea 62)

Los dots se generan con `projects.map((_, i)` pero deberian ser `galleryImages.map` para que coincida si hay mas imagenes que proyectos.

**Solución**: Cambiar a `galleryImages.map((_, i) => ...`.

---

### 16. Links externos sin `referrerpolicy`

**Archivos**: `src/components/Header.astro`, `src/components/Hero.astro`, `src/components/Videos.astro`

Los links externos a WhatsApp/Youtube/Instagram no tienen `referrerpolicy="no-referrer-when-downgrade"`.

**Solución**: Agregar `referrerpolicy="no-referrer-when-downgrade"` a todos los links con `target="_blank"`.

---

### 17. Seccion Ubicación sin subtitle

**Archivo**: `src/components/Location.astro` (linea 8)

`<Section title="Ubicación" />` sin subtitle, mientras todas las otras secciones tienen.

**Solución**: Agregar un subtitle descriptivo o mantener la consistencia con las otras secciones.

---

### 18. No hay `src/env.d.ts`

Astro normalmente lo genera automaticamente, pero si se agregan tipos de assets personalizados, podria ser necesario.

**Solución**: Crear `src/env.d.ts` si se necesitan tipos custom para assets o si se planifica expandir el proyecto a multiples paginas.

---

## Resumen de impacto

| Prioridad | Cantidad | Tiempo estimado |
|-----------|----------|-----------------|
| Críticas | 3 | ~30 min |
| Importantes | 6 | ~1.5-2 horas |
| Code Quality | 4 | ~1-2 horas |
| Menores | 5 | ~30 min |

**Total estimado**: 3 - 4.5 horas
