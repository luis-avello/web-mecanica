# Mecánica Avello SPA

Single-page website for a mechanic workshop specializing in 4x4, SUV, and pickup trucks.

**Live site**: https://mecanicaavello.cl (production server)

## 🚀 Project Structure

```text
/
├── public/
│   └── assets/              # Images (direct URL access)
│       ├── logo/
│       ├── quienes-somos/
│       ├── servicios/
│       ├── productos/
│       ├── proyectos/
│       └── ubicacion/
├── src/
│   ├── components/          # Astro components
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   ├── Hero.astro
│   │   ├── Section.astro
│   │   ├── About.astro
│   │   ├── Services.astro
│   │   ├── Products.astro
│   │   ├── Projects.astro
│   │   ├── Videos.astro
│   │   ├── Location.astro
│   │   └── Contact.astro
│   ├── content/             # Externalized content (JSON/MD)
│   │   ├── site.json
│   │   ├── about.md
│   │   ├── services.json
│   │   ├── products.json
│   │   ├── projects.json
│   │   └── videos.json
│   ├── pages/
│   │   └── index.astro
│   └── styles/
│       └── global.css
└── package.json
```

## 🧞 Commands

All commands are run from the root of the project:

| Command                  | Action                                      |
| ------------------------ | ------------------------------------------- |
| `npm install`            | Installs dependencies                       |
| `astro dev --background` | Starts local dev server at `localhost:4321` |
| `astro dev status`       | Check if dev server is running              |
| `astro dev logs`         | View dev server logs                        |
| `astro dev stop`         | Stop dev server                             |
| `npm run build`          | Build production site to `./dist/`          |
| `npm run preview`        | Preview build locally                       |

## 📝 Content Management

### Update site info

Edit `src/content/site.json` — phone, social links, address.

### Update "Quiénes Somos"

Edit `src/content/about.md` — markdown text. Images are in `public/assets/quienes-somos/`.

### Update Services

Edit `src/content/services.json` — add/edit services with name, image path, icon path.

### Update Products

Edit `src/content/products.json` — add/edit products with name, image path, icon path.

### Update Projects

Edit `src/content/projects.json` — add/edit projects with name and image path.

### Update Videos

Edit `src/content/videos.json` — update `embedId` with actual YouTube video IDs.

## 🎨 Design

- **Framework**: Astro v7.1.6 + Tailwind CSS v4
- **Theme**: Dark (#0A0A0A background, #E31E24 red accent, white text)
- **Sections**: inicio, quienes-somos, servicios, productos, proyectos, videos, ubicación, contacto

## ⚠️ Important Notes

- **No template literals** in `<script client:load>` — use string concatenation (`'text ' + var`)
- **Mobile menu** is outside `<header>` with `z-[9999]` and uses `data-menu-open` attribute
- **Swipe gestures** use mousedown/mouseup + touchstart/touchend with window listeners
- **Image assets** go in `public/assets/` for direct URL access (not `src/assets/`)
