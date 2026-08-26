# Mejoras del Proyecto — Mecánica Avello SPA

Lista de mejoras pendientes, organizadas por prioridad. Los ítems ya implementados fueron removidos de esta lista (ver historial en git).

---

## Críticas (afectan funcionalidad o rendimiento)

### 1. Assets duplicados

**Directorios**: `src/assets/` (69 MB) y `public/assets/` (85 MB)

Ambos directorios contienen contenido solapado. Solo se necesitan en `public/` ya que todas las imagenes se referencian como `/assets/...`. `src/assets/` tiene 2 archivos únicos que el sitio no usa: `logo sticker.jpg` y `logo vectorizado.svg`.

**Solución**: Verificar que ninguna ruta use `src/assets/` antes de borrar el directorio.

---

### 3. Archivos con espacios en el filename

**Alcance verificado** (no solo el logo):

- `public/assets/logo sin fondo.webp` + `.png` → `Header.astro:21`, `Footer.astro:10`
- `public/assets/inicio/Foto Inicio.webp` → `Hero.astro:9`
- `public/assets/quienes-somos/tema quienes somos_1..5.jpg` → `about.json` (`galleryImages`)
- `public/assets/proyectos/5 Foto Nomade y fondo.jpg` + 4 más → `projects.json` (`galleryImages`)
- `public/assets/proyectos/Foto fondo seccion Proyectos offroad.jpg` → `Projects.astro:24`

Funciona, pero es frágil y puede causar problemas en algunos servidores/configs.

**Solución**: Renombrar a kebab-case (`logo-sin-fondo.webp`, `foto-inicio.webp`, `tema-quienes-somos-1.jpg`, etc.) y actualizar referencias en `Header.astro`, `Footer.astro`, `Hero.astro`, `Projects.astro`, `about.json` y `projects.json`.

---

## Code Quality (limpieza y mantenibilidad)

### 4. Duplicación masiva: Scripts de carrusel (~70 líneas)

**Archivos**: `src/components/About.astro` (lineas 53-124) y `src/components/Projects.astro` (lineas 84-155)

El script del carrusel (click en dots + swipe/drag) esta duplicado casi identico.

**Solución**: Extraer a un componente reutilizable `Gallery.astro` que reciba `images`, `mainImageId`, `dotsId` como props.

---

### 5. Duplicación: Services.astro y Products.astro

**Archivos**: `src/components/Services.astro` y `src/components/Products.astro`

Son estructuralmente identicos (mismo grid, mismo hover, mismo CTA "Contáctanos"). Solo cambian los nombres de props.

**Solución**: Crear un componente `CardGrid.astro` reutilizable que reciba `items`, `title`, `ctaText`, `ctaHref` como props.

---

### 6. No hay `src/layouts/` + JSON-LD y meta de home hardcodeados

**Archivos**: `src/pages/index.astro` (lineas 24-81) y `src/content/site.json`

Dos problemas relacionados:

1. El `<head>` completo (compartido + especifico de pagina) esta hardcodeado en `index.astro`. Si se agrega una segunda pagina, se duplica el head compartido (charset, viewport, icon, theme-color, preconnects, fuentes, `<Analytics/>`, `<SpeedInsights/>`).
2. El JSON-LD (lineas 56-78) y varios meta duplan datos que ya existen en `site.json` (name, address, phone, email, sameAs).

Importante: ~90% del head es especifico de la home (title, description, canonical, OG, JSON-LD). Una segunda pagina necesita su propio meta, asi que el layout no puede absorber el `<head>` tal cual.

**Solución**: (recomendada solo cuando exista una segunda pagina.) Crear `src/layouts/BaseLayout.astro` con el doctype, head compartido, `<Header/>` y `<Footer/>`, y un slot para el meta especifico de cada pagina (cada pagina aporta su propio title, description, canonical y OG). Ademas, derivar el JSON-LD desde `site.json` para eliminar la duplicacion.

---

## Menores (pulido y detalles)

### 7. About.astro y Projects.astro: `data-images` expone datos internos en el DOM

**Archivos**: `src/components/About.astro` (linea 13) y `src/components/Projects.astro` (linea 17)

`JSON.stringify(galleryImages)` se inyecta directamente en un atributo `data-images` del DOM. Si una imagen tiene comillas o caracteres especiales, podria romper el JSON.

**Solución**: Leer las imagenes directamente del DOM, o pasarlas via un `<script type="application/json">` oculto.

---
