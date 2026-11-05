import type { ContentItem } from '../types';

const KEY = 'cribl_library_v6';
const SEED_KEY = 'cribl_library_seed_2026-06-18';

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
