import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import assert from 'node:assert';
import { describe, it } from 'node:test';

const root = process.cwd();
const contentDir = join(root, 'src', 'content');
const assetsDir = join(root, 'public', 'assets');

function loadJson(filename) {
  const filepath = join(contentDir, filename);
  assert.ok(existsSync(filepath), `Archivo no encontrado: ${filename}`);
  const raw = readFileSync(filepath, 'utf-8');
  return JSON.parse(raw);
}

function assetExists(assetPath) {
  if (!assetPath || !assetPath.startsWith('/assets/')) return false;
  const localPath = assetPath.replace('/assets/', '');
  return existsSync(join(assetsDir, localPath));
}

// ==================== site.json ====================
describe('site.json', () => {
  const site = loadJson('site.json');

  it('es un objeto', () => {
    assert.strictEqual(typeof site, 'object');
  });

  it('name es string no vacio', () => {
    assert.ok(typeof site.name === 'string' && site.name.length > 0);
  });

  it('tagline es string no vacio', () => {
    assert.ok(typeof site.tagline === 'string' && site.tagline.length > 0);
  });

  it('subtitle es string no vacio', () => {
    assert.ok(typeof site.subtitle === 'string' && site.subtitle.length > 0);
  });

  it('phone es string no vacio', () => {
    assert.ok(typeof site.phone === 'string' && site.phone.length > 0);
  });

  it('email es string no vacio', () => {
    assert.ok(typeof site.email === 'string' && site.email.length > 0);
  });

  it('address es string no vacio', () => {
    assert.ok(typeof site.address === 'string' && site.address.length > 0);
  });

  it('whatsapp es URL valida', () => {
    assert.doesNotThrow(() => new URL(site.whatsapp));
  });

  it('instagram es URL valida', () => {
    assert.doesNotThrow(() => new URL(site.instagram));
  });

  it('youtube es URL valida', () => {
    assert.doesNotThrow(() => new URL(site.youtube));
  });

  it('mapsUrl es URL valida', () => {
    assert.doesNotThrow(() => new URL(site.mapsUrl));
  });

  it('agendaGestioncar es URL valida', () => {
    assert.doesNotThrow(() => new URL(site.agendaGestioncar));
  });

  it('phone tiene formato internacional', () => {
    assert.ok(/^\+\d+/.test(site.phone));
  });

  it('email tiene formato valido', () => {
    assert.ok(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(site.email));
  });
});

// ==================== about.json ====================
describe('about.json', () => {
  const about = loadJson('about.json');

  it('es un objeto', () => {
    assert.strictEqual(typeof about, 'object');
  });

  it('title es string no vacio', () => {
    assert.ok(typeof about.title === 'string' && about.title.length > 0);
  });

  it('paragraphs es array', () => {
    assert.ok(Array.isArray(about.paragraphs));
  });

  it('tiene al menos 3 paragraphs', () => {
    assert.ok(about.paragraphs.length >= 3);
  });

  it('galleryImages es array', () => {
    assert.ok(Array.isArray(about.galleryImages));
  });

  it('tiene al menos 3 galleryImages', () => {
    assert.ok(about.galleryImages.length >= 3);
  });

  it('todos los paragraphs son string con longitud razonable', () => {
    about.paragraphs.forEach((p, i) => {
      assert.ok(typeof p === 'string', `paragraph[${i}] es string`);
      assert.ok(p.length > 50, `paragraph[${i}] tiene ${p.length} chars`);
    });
  });

  it('todos los galleryImages existen en filesystem', () => {
    about.galleryImages.forEach((img, i) => {
      assert.ok(typeof img === 'string', `galleryImages[${i}] es string`);
      assert.ok(img.startsWith('/assets/'), `galleryImages[${i}] empieza con /assets/`);
      assert.ok(assetExists(img), `galleryImages[${i}] existe: ${img}`);
    });
  });
});

// ==================== services.json ====================
describe('services.json', () => {
  const services = loadJson('services.json');

  it('es un array', () => {
    assert.ok(Array.isArray(services));
  });

  it('tiene al menos 5 servicios', () => {
    assert.ok(services.length >= 5, `tiene ${services.length}`);
  });

  services.forEach((service, i) => {
    it(`service[${i}] tiene estructura valida`, () => {
      assert.strictEqual(typeof service, 'object');
      assert.ok(typeof service.name === 'string' && service.name.length > 0);
      assert.ok(service.image.startsWith('/assets/'));
      assert.ok(assetExists(service.image), `image existe: ${service.image}`);
      assert.ok(service.icon.startsWith('/assets/'));
      assert.ok(assetExists(service.icon), `icon existe: ${service.icon}`);
    });
  });
});

// ==================== products.json ====================
describe('products.json', () => {
  const products = loadJson('products.json');

  it('es un array', () => {
    assert.ok(Array.isArray(products));
  });

  it('tiene al menos 3 productos', () => {
    assert.ok(products.length >= 3, `tiene ${products.length}`);
  });

  products.forEach((product, i) => {
    it(`product[${i}] tiene estructura valida`, () => {
      assert.strictEqual(typeof product, 'object');
      assert.ok(typeof product.name === 'string' && product.name.length > 0);
      assert.ok(product.image.startsWith('/assets/'));
      assert.ok(assetExists(product.image), `image existe: ${product.image}`);
      assert.ok(product.icon.startsWith('/assets/'));
      assert.ok(assetExists(product.icon), `icon existe: ${product.icon}`);
    });
  });
});

// ==================== projects.json ====================
describe('projects.json', () => {
  const projects = loadJson('projects.json');

  it('es un objeto', () => {
    assert.strictEqual(typeof projects, 'object');
  });

  it('projects es array', () => {
    assert.ok(Array.isArray(projects.projects));
  });

  it('tiene al menos 2 proyectos', () => {
    assert.ok(projects.projects.length >= 2);
  });

  it('galleryImages es array', () => {
    assert.ok(Array.isArray(projects.galleryImages));
  });

  it('tiene al menos 3 galleryImages', () => {
    assert.ok(projects.galleryImages.length >= 3);
  });

  it('todos los projects tienen estructura valida', () => {
    projects.projects.forEach((p, i) => {
      assert.strictEqual(typeof p, 'object');
      assert.ok(typeof p.name === 'string' && p.name.length > 0);
      assert.ok(p.icon.startsWith('/assets/'));
      assert.ok(assetExists(p.icon), `icon existe: ${p.icon}`);
    });
  });

  it('todos los galleryImages existen en filesystem', () => {
    projects.galleryImages.forEach((img, i) => {
      assert.ok(typeof img === 'string');
      assert.ok(img.startsWith('/assets/'));
      assert.ok(assetExists(img), `galleryImages[${i}] existe: ${img}`);
    });
  });
});

// ==================== videos.json ====================
describe('videos.json', () => {
  const videos = loadJson('videos.json');
  const youtubeRegex = /^[a-zA-Z0-9_-]{11}$/;

  it('es un array', () => {
    assert.ok(Array.isArray(videos));
  });

  it('tiene al menos 3 videos', () => {
    assert.ok(videos.length >= 3, `tiene ${videos.length}`);
  });

  videos.forEach((video, i) => {
    it(`video[${i}] tiene estructura valida`, () => {
      assert.strictEqual(typeof video, 'object');
      assert.ok(typeof video.title === 'string' && video.title.length > 0);
      assert.ok(typeof video.embedId === 'string');
      assert.ok(youtubeRegex.test(video.embedId), `embedId valido: ${video.embedId}`);
    });
  });
});

// ==================== Consistencia ====================
describe('Consistencia de contenido', () => {
  const services = loadJson('services.json');
  const products = loadJson('products.json');

  it('no hay servicios con nombre duplicado', () => {
    const names = services.map(s => s.name.toLowerCase());
    const duplicates = names.filter((name, i) => names.indexOf(name) !== i);
    assert.equal(duplicates.length, 0);
  });

  it('no hay productos con nombre duplicado', () => {
    const names = products.map(p => p.name.toLowerCase());
    const duplicates = names.filter((name, i) => names.indexOf(name) !== i);
    assert.equal(duplicates.length, 0);
  });

  it('nombres de servicios no son demasiado largos', () => {
    services.forEach((s, i) => {
      assert.ok(s.name.length <= 60, `service[${i}] tiene ${s.name.length} chars`);
    });
  });

  it('nombres de productos no son demasiado largos', () => {
    products.forEach((p, i) => {
      assert.ok(p.name.length <= 60, `product[${i}] tiene ${p.name.length} chars`);
    });
  });
});
