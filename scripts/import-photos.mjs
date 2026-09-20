#!/usr/bin/env node
/**
 * Turns a folder of raw photographs into the site's image assets.
 *
 *   npm run photos              # reads ./photos, writes ./public/images
 *   npm run photos -- --dry-run # report what it would do, write nothing
 *   npm run photos -- ../shared-drive/wings
 *
 * Expected layout of the source folder (any of jpg/jpeg/png/webp/tif):
 *
 *   photos/
 *     huddle-hero.jpg         the huddle, wide — the whole site opens on it
 *     huddle-final.jpg        the huddle, tighter crop (chapter 06)
 *     sky-sunset.jpg          sunset, silhouettes low in frame (chapter 07)
 *     year-01.jpg             1年生 / 初大会
 *     year-02.jpg             2年生 / 新体制
 *     year-03.jpg             3年生 / 最後の大会
 *     memories/*.jpg          the memory cloud, in filename order
 *     members/*.jpg           one portrait per member; the file's name
 *                             becomes the member id
 *
 * Every slot is optional — import what you have, run it again as more
 * photographs arrive. Nothing is deleted that this run didn't write.
 *
 * EXIF is read for orientation and then dropped, so camera and phone
 * originals don't carry GPS coordinates or device names onto a public
 * site.
 */

import { readdir, mkdir, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const sharp = require('sharp');

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'public', 'images');
const SOURCE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.tif', '.tiff', '.avif']);

/**
 * Each slot names the size the layout wants.
 *
 * The three full-bleed scenes keep their whole frame (`aspect: null`) and
 * are only resized: their sections crop them at display time through
 * `objectPosition`, so framing stays adjustable in the component instead
 * of being baked in here — and a forced 2.9:1 crop of a huddle is exactly
 * the kind of thing that takes the tops of heads off.
 *
 * The card slots do get cropped, because their shape is fixed by the
 * layout and cropping here keeps the files small.
 */
const SLOTS = {
  // The opening pushes in to 420%, so the huddle carries more pixels than
  // anything else on the site — the close-up frames are real pixels, not
  // an upscale. Next serves smaller variants from it automatically.
  'huddle-hero': { width: 3600, aspect: null, quality: 90 },
  'huddle-final': { width: 3000, aspect: null, quality: 90 },
  'sky-sunset': { width: 2000, aspect: null, quality: 90 },
  'year-01': { width: 1400, aspect: 16 / 10, quality: 88 },
  'year-02': { width: 1400, aspect: 16 / 10, quality: 88 },
  'year-03': { width: 1400, aspect: 16 / 10, quality: 88 },
};

const MEMORY = { width: 1200, aspect: 4 / 3, quality: 86 };
const MEMBER = { width: 1200, aspect: 3 / 4, quality: 88 };

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const sourceArg = args.find((a) => !a.startsWith('--'));
const SRC = path.resolve(ROOT, sourceArg ?? 'photos');

const written = [];
const skipped = [];

/** Lists image files in a directory, sorted, ignoring anything else. */
async function listImages(dir) {
  if (!existsSync(dir)) return [];
  const entries = await readdir(dir, { withFileTypes: true });
  return entries
    .filter((e) => e.isFile() && SOURCE_EXTENSIONS.has(path.extname(e.name).toLowerCase()))
    .map((e) => e.name)
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
}

/** Finds `<dir>/<name>.<any supported extension>`. */
function findBySlotName(dir, name) {
  for (const ext of SOURCE_EXTENSIONS) {
    const candidate = path.join(dir, name + ext);
    if (existsSync(candidate)) return candidate;
  }
  return null;
}

async function convert(from, toRelative, { width, aspect, quality }) {
  const to = path.join(OUT, toRelative);
  const original = sharp(from);
  const meta = await original.metadata();

  // `rotate()` with no argument applies the EXIF orientation and then
  // discards it, which is what phone photos need.
  let pipeline = original.rotate();

  if (aspect) {
    pipeline = pipeline.resize({
      width: Math.round(width),
      height: Math.round(width / aspect),
      fit: 'cover',
      // `attention` keeps faces in frame far more often than a centre
      // crop does, which matters most for the portrait slots.
      position: sharp.strategy.attention,
      withoutEnlargement: false,
    });
  } else {
    pipeline = pipeline.resize({ width: Math.round(width), withoutEnlargement: false });
  }

  const label = `${meta.width}×${meta.height} → ${toRelative}`;

  if (dryRun) {
    written.push(label);
    return;
  }

  await mkdir(path.dirname(to), { recursive: true });
  await pipeline.webp({ quality }).toFile(to);

  const { size } = await stat(to);
  written.push(`${label}  (${(size / 1024).toFixed(0)} KB)`);
}

async function main() {
  if (!existsSync(SRC)) {
    console.error(`\nNo source folder at ${path.relative(ROOT, SRC) || SRC}`);
    console.error('Create it and drop the photographs in — see the header of this file');
    console.error('or the README for the expected layout.\n');
    process.exit(1);
  }

  console.log(`\nReading  ${path.relative(ROOT, SRC)}`);
  console.log(`Writing  ${path.relative(ROOT, OUT)}${dryRun ? '   (dry run — nothing written)' : ''}\n`);

  // Fixed slots
  for (const [name, spec] of Object.entries(SLOTS)) {
    const found = findBySlotName(SRC, name);
    if (!found) {
      skipped.push(name);
      continue;
    }
    await convert(found, `${name}.webp`, spec);
  }

  // Memories — numbered in filename order
  const memories = await listImages(path.join(SRC, 'memories'));
  for (const [i, file] of memories.entries()) {
    const slot = `memory-${String(i + 1).padStart(2, '0')}`;
    await convert(path.join(SRC, 'memories', file), `${slot}.webp`, MEMORY);
  }
  if (memories.length === 0) skipped.push('memories/');

  // Members — the filename becomes the member id
  const members = await listImages(path.join(SRC, 'members'));
  for (const file of members) {
    const id = path.basename(file, path.extname(file));
    await convert(path.join(SRC, 'members', file), path.join('members', `${id}.webp`), MEMBER);
  }
  if (members.length === 0) skipped.push('members/');

  for (const line of written) console.log('  ' + line);
  if (written.length === 0) console.log('  (nothing matched)');

  if (skipped.length > 0) {
    console.log('\nNot supplied yet: ' + skipped.join(', '));
    console.log('Existing files for those slots were left alone.');
  }

  console.log(`\n${written.length} image${written.length === 1 ? '' : 's'} ready.`);

  if (memories.length > 0) {
    console.log(`\nMemory cloud: ${memories.length} photo${memories.length === 1 ? '' : 's'}.`);
    console.log('  Set MEMORY_COUNT in src/lib/content.ts to match.');
  }
  if (members.length > 0) {
    console.log(`\nMember portraits: ${members.map((f) => path.basename(f, path.extname(f))).join(', ')}`);
    console.log("  Add `photo: '/images/members/<id>.webp'` to the matching roster entry");
    console.log('  in src/lib/content.ts.');
  }
  console.log('');
}

main().catch((error) => {
  console.error('\nImport failed:', error.message, '\n');
  process.exit(1);
});
