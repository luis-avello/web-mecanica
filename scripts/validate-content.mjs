#!/usr/bin/env node

import { readFileSync, existsSync } from 'fs';
import { join, relative } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const root = join(__dirname, '..');
const contentDir = join(root, 'src', 'content');
const assetsDir = join(root, 'public', 'assets');

let errors = 0;
let warnings = 0;
let passed = 0;

function log(level, message, file = '') {
  const prefix = file ? ` ${file}` : '';
  const icon = level === 'error' ? '❌' : level === 'warning' ? '⚠️' : '✅';
  console.log(`${icon} [${level.toUpperCase()}]${prefix} ${message}`);
  if (level === 'error') errors++;
  if (level === 'warning') warnings++;
  if (level === 'pass') passed++;
}

function fileExists(assetPath) {
  if (!assetPath || !assetPath.startsWith('/assets/')) return false;
  const localPath = assetPath.replace('/assets/', '');
  const fullPath = join(assetsDir, localPath);
  return existsSync(fullPath);
}

function validateJson(filename, requiredFields = []) {
  const filepath = join(contentDir, filename);
  if (!existsSync(filepath)) {
    log('error', `Archivo no encontrado: ${filename}`);
    return null;
  }

  try {
    const raw = readFileSync(filepath, 'utf-8');
    const data = JSON.parse(raw);
    log('pass', `JSON valido: ${filename}`);

    if (Array.isArray(requiredFields) && requiredFields.length > 0) {
      for (const field of requiredFields) {
        if (!(field in data)) {
          log('error', `Campo requerido faltante: "${field}"`, filename);
        } else {
          log('pass', `Campo "${field}" presente`, filename);
        }
      }
    }

    return data;
  } catch (e) {
    log('error', `JSON invalido: ${e.message}`, filename);
    return null;
  }
}

function validateImageArray(filename, images, baseField = '') {
  const prefix = baseField ? `${filename}[${baseField}]` : filename;

  if (!Array.isArray(images)) {
    log('error', `Se esperaba un array, se recibio: ${typeof images}`, prefix);
    return;
  }

  if (images.length === 0) {
    log('warning', `Array vacio: ${baseField || 'images'}`, prefix);
    return;
  }

  for (let i = 0; i < images.length; i++) {
    const img = images[i];
    if (typeof img !== 'string') {
      log('error', `Elemento no es string en index ${i}: ${typeof img}`, prefix);
      continue;
    }

    if (!img.startsWith('/assets/')) {
      log('error', `Ruta invalida (no empieza con /assets/): "${img}"`, prefix);
      continue;
    }

    if (!fileExists(img)) {
      log('error', `Imagen no encontrada en filesystem: "${img}"`, prefix);
    } else {
      log('pass', `Imagen existe: "${img}"`, prefix);
    }
  }
}

function validateItemArray(filename, items, requiredFields = [], imageFields = [], baseField = '') {
  const prefix = baseField ? `${filename}[${baseField}]` : filename;

  if (!Array.isArray(items)) {
    log('error', `Se esperaba un array, se recibio: ${typeof items}`, prefix);
    return;
  }

  if (items.length === 0) {
    log('warning', `Array vacio: ${baseField || 'items'}`, prefix);
    return;
  }

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const itemPrefix = `${prefix}[${i}]`;

    if (typeof item !== 'object' || item === null) {
      log('error', `Elemento no es objeto en index ${i}`, itemPrefix);
      continue;
    }

    for (const field of requiredFields) {
      if (!(field in item)) {
        log('error', `Campo requerido faltante: "${field}"`, itemPrefix);
      } else if (typeof item[field] !== 'string' || item[field].length === 0) {
        log('error', `Campo "${field}" debe ser string no vacio`, itemPrefix);
      } else {
        log('pass', `Campo "${field}" valido`, itemPrefix);
      }
    }

    for (const field of imageFields) {
      if (field in item) {
        const imgPath = item[field];
        if (typeof imgPath === 'string' && imgPath.startsWith('/assets/')) {
          if (!fileExists(imgPath)) {
            log('error', `Imagen no encontrada: "${imgPath}"`, itemPrefix);
          } else {
            log('pass', `Imagen existe: "${imgPath}"`, itemPrefix);
          }
        }
      }
    }
  }
}

console.log('\n========================================');
console.log('  Content Validation — Mecánica Avello');
console.log('========================================\n');

// --- site.json ---
console.log('--- site.json ---');
const site = validateJson('site.json', ['name', 'tagline', 'subtitle', 'phone', 'whatsapp', 'instagram', 'email', 'youtube', 'address', 'mapsUrl', 'agendaGestioncar']);
if (site) {
  // Validate URL formats
  const urlFields = ['whatsapp', 'instagram', 'youtube', 'mapsUrl', 'agendaGestioncar'];
  for (const field of urlFields) {
    if (site[field]) {
      try {
        new URL(site[field]);
        log('pass', `URL valida: ${field}`, 'site.json');
      } catch {
        log('error', `URL invalida: ${field} = "${site[field]}"`, 'site.json');
      }
    }
  }
}

// --- about.json ---
console.log('\n--- about.json ---');
const about = validateJson('about.json', ['title', 'paragraphs', 'galleryImages']);
if (about) {
  if (Array.isArray(about.paragraphs)) {
    about.paragraphs.forEach((p, i) => {
      if (typeof p === 'string' && p.length > 0) {
        log('pass', `Paragraph ${i}: ${p.length} chars`, 'about.json');
      } else {
        log('error', `Paragraph ${i} invalido`, 'about.json');
      }
    });
  }
  validateImageArray('about.json', about.galleryImages, 'galleryImages');
}

// --- services.json ---
console.log('\n--- services.json ---');
const services = validateJson('services.json');
if (services) {
  validateItemArray('services.json', services, ['name', 'image', 'icon'], ['image', 'icon'], 'services');
}

// --- products.json ---
console.log('\n--- products.json ---');
const products = validateJson('products.json');
if (products) {
  validateItemArray('products.json', products, ['name', 'image', 'icon'], ['image', 'icon'], 'products');
}

// --- projects.json ---
console.log('\n--- projects.json ---');
const projects = validateJson('projects.json', ['projects', 'galleryImages']);
if (projects) {
  validateItemArray('projects.json', projects.projects, ['name', 'icon'], ['icon'], 'projects');
  validateImageArray('projects.json', projects.galleryImages, 'galleryImages');
}

// --- videos.json ---
console.log('\n--- videos.json ---');
const videos = validateJson('videos.json');
if (videos) {
  const youtubeRegex = /^[a-zA-Z0-9_-]{11}$/;
  for (let i = 0; i < videos.length; i++) {
    const video = videos[i];
    const prefix = `videos.json[${i}]`;

    if (typeof video.title === 'string' && video.title.length > 0) {
      log('pass', `Title valido`, prefix);
    } else {
      log('error', `Title invalido`, prefix);
    }

    if (youtubeRegex.test(video.embedId)) {
      log('pass', `YouTube embedId valido: ${video.embedId}`, prefix);
    } else {
      log('error', `YouTube embedId invalido (debe ser 11 chars): "${video.embedId}"`, prefix);
    }
  }
}

// --- Summary ---
console.log('\n========================================');
console.log(`  Results: ${passed} passed, ${warnings} warnings, ${errors} errors`);
console.log('========================================\n');

process.exit(errors > 0 ? 1 : 0);
