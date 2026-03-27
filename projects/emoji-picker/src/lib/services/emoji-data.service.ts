import { Injectable, computed, signal } from '@angular/core';
import { Emoji, EmojiCategory, SkinTone } from '../models/emoji.model';
import { EMOJI_DATA } from '../data/emoji-data';

@Injectable({ providedIn: 'root' })
export class EmojiDataService {
  readonly allEmojis = signal<Emoji[]>(EMOJI_DATA);

  readonly groupedByCategory = computed(() => {
    const map = new Map<EmojiCategory, Emoji[]>();
    for (const emoji of this.allEmojis()) {
      const list = map.get(emoji.category);
      if (list) {
        list.push(emoji);
      } else {
        map.set(emoji.category, [emoji]);
      }
    }
    return map;
  });

  getEmojiWithSkinTone(emoji: Emoji, skinTone: SkinTone): string {
    if (!skinTone || !emoji.hasSkinTone) {
      return emoji.char;
    }
    const base = emoji.base ?? emoji.char;
    // Simple single emoji: just append skin tone after the base character
    const firstCodePoint = base.codePointAt(0);
    if (!firstCodePoint) return base;
    const firstChar = String.fromCodePoint(firstCodePoint);
    return firstChar + skinTone;
  }
}
