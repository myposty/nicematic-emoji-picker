import { Injectable } from '@angular/core';
import { Emoji } from '@nicematic/emoji-picker';
import { EMOJI_DATA } from '@nicematic/emoji-picker';

@Injectable({ providedIn: 'root' })
export class EmojiSearchService {
  private readonly index = new Map<string, Set<number>>();
  private readonly emojis = EMOJI_DATA;

  constructor() {
    this.buildIndex();
  }

  search(query: string): Emoji[] {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    const tokens = q.split(/\s+/);
    let matchedIndices: Set<number> | null = null;
    for (const token of tokens) {
      const tokenMatches = new Set<number>();
      for (const [key, indices] of this.index) {
        if (key.includes(token)) {
          for (const i of indices) tokenMatches.add(i);
        }
      }
      if (matchedIndices === null) {
        matchedIndices = tokenMatches;
      } else {
        for (const i of matchedIndices) {
          if (!tokenMatches.has(i)) matchedIndices.delete(i);
        }
      }
      if (matchedIndices.size === 0) return [];
    }
    return matchedIndices ? Array.from(matchedIndices).map(i => this.emojis[i]) : [];
  }

  private buildIndex(): void {
    for (let i = 0; i < this.emojis.length; i++) {
      const emoji = this.emojis[i];
      const terms = [
        ...emoji.name.toLowerCase().split(/[\s_-]+/),
        ...emoji.keywords.map(k => k.toLowerCase()),
      ];
      for (const term of terms) {
        if (!term) continue;
        const set = this.index.get(term);
        if (set) set.add(i);
        else this.index.set(term, new Set([i]));
      }
    }
  }
}
