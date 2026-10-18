import { defineCollection } from 'astro:content';
import { file } from 'astro/loaders';
import { z } from 'astro/zod';
import { CATEGORIES } from './data/categories';

const catIds = CATEGORIES.map((c) => c.id) as [string, ...string[]];

// items.json is a plain array in display order; ids are generated from position.
const items = defineCollection({
  loader: file('src/content/items.json', {
    parser: (text) =>
      (JSON.parse(text) as object[]).map((item, i) => ({ id: String(i).padStart(4, '0'), ...item })),
  }),
  schema: ({ image }) =>
    z.object({
      cat: z.enum(catIds),
      title: z.string(),
      tag: z.string(),
      desc: z.string(),
      // TODO(talk-links): "#" marks an item with no link yet; it renders without a link.
      href: z.string().refine((s) => s === '#' || s.startsWith('/') || /^https?:\/\//.test(s), 'href must be a URL, a /path or "#"'),
      link: z.string(),
      img: image().optional(), // landscape 16:9
      portrait: image().optional(), // 4:5, used when the main item flips to portrait
      badge: z.string().optional(),
      focus: z.string().optional(), // CSS object-position, e.g. "30% 20%"
    }),
});

export const collections = { items };
