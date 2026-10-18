import { getCollection, type CollectionEntry } from 'astro:content';

export type Item = CollectionEntry<'items'>['data'];

/** Every item, in items.json order. */
export async function getItems(): Promise<Item[]> {
  const entries = await getCollection('items');
  return entries.sort((a, b) => a.id.localeCompare(b.id)).map((e) => e.data);
}

export const hasLink = (i: Item) => i.href !== '#';
export const isExternal = (i: Item) => /^https?:\/\//.test(i.href);
