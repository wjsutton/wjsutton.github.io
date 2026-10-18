// Downloads any remote `img` / `portrait` URLs in src/content/items.json into
// src/assets/items/ and rewrites the entries to point at the local files.
// Safe to re-run: local paths are left alone.  Usage: npm run fetch-images
import { readFile, writeFile } from 'node:fs/promises';

const DATA = new URL('../src/content/items.json', import.meta.url);
const DIR = new URL('../src/assets/items/', import.meta.url);
const EXT = { 'image/png': 'png', 'image/jpeg': 'jpg', 'image/webp': 'webp', 'image/gif': 'gif' };

const slug = (s) => s.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const items = JSON.parse(await readFile(DATA, 'utf8'));

for (const item of items) {
  for (const field of ['img', 'portrait']) {
    const url = item[field];
    if (!url?.startsWith('http')) continue;
    const res = await fetch(url);
    const ext = EXT[res.headers.get('content-type')?.split(';')[0]];
    if (!res.ok || !ext) {
      console.warn(`skip ${url} (${res.status} ${res.headers.get('content-type')})`);
      continue;
    }
    const name = `${item.cat}-${slug(item.title)}${field === 'portrait' ? '-portrait' : ''}.${ext}`;
    await writeFile(new URL(name, DIR), Buffer.from(await res.arrayBuffer()));
    item[field] = `../assets/items/${name}`;
    console.log(`${name}  <-  ${url}`);
  }
}

await writeFile(DATA, JSON.stringify(items, null, 2) + '\n');
