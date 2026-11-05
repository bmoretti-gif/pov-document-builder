import type { ContentItem } from '../types';

const KEY = 'cribl_library_v6';
const SEED_KEY = 'cribl_library_seed_2026-06-18';

export function syncOfficialCatalog(storage: Pick<Storage, 'getItem' | 'setItem'>, library: Record<string, ContentItem>, entries: Record<string, ContentItem>): Record<string, ContentItem> {
  let previous: Record<string, ContentItem> = {};
  try { previous = JSON.parse(storage.getItem('cribl_official_catalog_seen') || '{}'); } catch { /* Start fresh if marker is invalid. */ }
  const merged = {...library};
  for (const [key, entry] of Object.entries(entries)) {
    if (merged[key]) {
      if (previous[key] && JSON.stringify(merged[key]) === JSON.stringify(previous[key])) merged[key] = entry;
    } else if (!previous[key]) {
      const slug = entry.documentationUrl?.match(/\/(sources-[\w-]+|collectors-[\w-]+)\/?$/)?.[1];
      const alreadyCovered = slug && Object.values(merged).some(item => item.category === entry.category && new RegExp('/' + slug + '(?:/|\\.md|[)#\\s]|$)').test(item.content));
      if (!alreadyCovered) merged[key] = entry;
    }
    previous[key] = entry;
  }
  storage.setItem('cribl_official_catalog_seen', JSON.stringify(previous));
  return merged;
}

export function loadLibrary(storage: Pick<Storage, 'getItem' | 'setItem'>, defaults: Record<string, ContentItem>): Record<string, ContentItem> {
  let saved: Record<string, ContentItem> = {};
  try {
    const raw = storage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error('Invalid library');
      saved = parsed;
    }
    if (storage.getItem(SEED_KEY)) return saved;
    // Existing edits win. Seed only once so deleted default items stay deleted.
    const merged = { ...defaults, ...saved };
    storage.setItem(KEY, JSON.stringify(merged));
    storage.setItem(SEED_KEY, '1');
    return merged;
  } catch (error) {
    console.error('Library initialization failed', error);
    return { ...defaults, ...saved };
  }
}
