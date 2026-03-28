import { Injectable } from '@angular/core';
import { Emoji, EmojiCategory, SkinTone } from '@nicematic/emoji-picker';
import { EMOJI_DATA } from '@nicematic/emoji-picker';

@Injectable({ providedIn: 'root' })
export class EmojiDataService {
  readonly allEmojis: Emoji[] = EMOJI_DATA;

  get groupedByCategory(): Map<EmojiCategory, Emoji[]> {
    const map = new Map<EmojiCategory, Emoji[]>();
    for (const emoji of this.allEmojis) {
      const list = map.get(emoji.category);
      if (list) list.push(emoji);
      else map.set(emoji.category, [emoji]);
    }
    return map;
  }

  getEmojiWithSkinTone(emoji: Emoji, skinTone: SkinTone): string {
    if (!skinTone || !emoji.hasSkinTone) return emoji.char;
    const base = emoji.base ?? emoji.char;
    const ZWJ = '\u200D';
    const VS16 = '\uFE0F';
    const parts = base.split(ZWJ);
    const result = parts.map(part => {
      const clean = part.replace(/[\u{1F3FB}-\u{1F3FF}]/gu, '').replace(VS16, '');
      const cp = clean.codePointAt(0);
      if (!cp) return part;
      if (this.isHumanCodepoint(cp)) return String.fromCodePoint(cp) + skinTone;
      return part;
    });
    return result.join(ZWJ);
  }

  private isHumanCodepoint(cp: number): boolean {
    return (
      (cp >= 0x1F466 && cp <= 0x1F487) || (cp >= 0x1F4AA && cp <= 0x1F4AA) ||
      (cp >= 0x1F590 && cp <= 0x1F596) || (cp >= 0x1F645 && cp <= 0x1F64F) ||
      (cp >= 0x1F6A3 && cp <= 0x1F6A3) || (cp >= 0x1F6B4 && cp <= 0x1F6B6) ||
      (cp >= 0x1F6C0 && cp <= 0x1F6C0) || (cp >= 0x1F90C && cp <= 0x1F91F) ||
      (cp >= 0x1F926 && cp <= 0x1F939) || (cp >= 0x1F93C && cp <= 0x1F93E) ||
      (cp >= 0x1F977 && cp <= 0x1F977) || (cp >= 0x1F9B5 && cp <= 0x1F9B6) ||
      (cp >= 0x1F9B8 && cp <= 0x1F9B9) || (cp >= 0x1F9BB && cp <= 0x1F9BB) ||
      (cp >= 0x1F9CD && cp <= 0x1F9CF) || (cp >= 0x1F9D1 && cp <= 0x1F9DD) ||
      (cp >= 0x1FAC3 && cp <= 0x1FAC5) || (cp >= 0x1FAF0 && cp <= 0x1FAF8) ||
      cp === 0x261D || cp === 0x270A || cp === 0x270B || cp === 0x270C || cp === 0x270D ||
      cp === 0x1F385 || cp === 0x1F3C2 || cp === 0x1F3C3 || cp === 0x1F3C4 ||
      cp === 0x1F3C7 || cp === 0x1F3CA || cp === 0x1F3CB || cp === 0x1F3CC ||
      cp === 0x1F442 || cp === 0x1F443 || (cp >= 0x1F446 && cp <= 0x1F450) ||
      cp === 0x1F57A || cp === 0x1F574 || cp === 0x1F575 || cp === 0x1F934 ||
      cp === 0x1F936 || cp === 0x1F930 || cp === 0x1F935
    );
  }
}
