import { Injectable, computed, signal } from '@angular/core';
import { Emoji, EmojiLocale } from '../models/emoji.model';
import { EMOJI_DATA } from '../data/emoji-data';
import { getSearchTranslations } from '../data/translations';

@Injectable({ providedIn: 'root' })
export class EmojiSearchService {
  private readonly emojis = EMOJI_DATA;

  readonly locale = signal<EmojiLocale>('en');
  readonly query = signal('');

  private readonly index = computed(() => {
    return this.buildIndex(this.locale());
  });

  readonly results = computed<Emoji[]>(() => {
    const q = this.query().trim().toLowerCase();
    if (!q) return [];

    const index = this.index();
    const tokens = q.split(/\s+/);
    let matchedIndices: Set<number> | null = null;

    for (const token of tokens) {
      const tokenMatches = new Set<number>();
      for (const [key, indices] of index) {
        if (key.includes(token)) {
          for (const i of indices) {
            tokenMatches.add(i);
          }
        }
      }
      if (matchedIndices === null) {
        matchedIndices = tokenMatches;
      } else {
        for (const i of matchedIndices) {
          if (!tokenMatches.has(i)) {
            matchedIndices.delete(i);
          }
        }
      }
      if (matchedIndices.size === 0) return [];
    }

    return matchedIndices ? Array.from(matchedIndices).map(i => this.emojis[i]) : [];
  });

  private buildIndex(locale: EmojiLocale): Map<string, Set<number>> {
    const index = new Map<string, Set<number>>();
    const translations = getSearchTranslations(locale);

    for (let i = 0; i < this.emojis.length; i++) {
      const emoji = this.emojis[i];
      const terms = [
        ...emoji.name.toLowerCase().split(/[\s_-]+/),
        ...emoji.keywords.map(k => k.toLowerCase()),
      ];

      if (translations) {
        for (const term of [...terms]) {
          const trans = translations[term];
          if (trans) {
            terms.push(...trans);
          }
        }
      }

      for (const term of terms) {
        if (!term) continue;
        const set = index.get(term);
        if (set) {
          set.add(i);
        } else {
          index.set(term, new Set([i]));
        }
      }
    }

    return index;
  }
}
