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
    const ZWJ = '\u200D';
    const VS16 = '\uFE0F';

    // Split by ZWJ to handle composite emojis (👨‍⚕️, 👩‍🍳, etc.)
    const parts = base.split(ZWJ);
    const result = parts.map(part => {
      // Strip existing skin tones and VS16
      const clean = part.replace(/[\u{1F3FB}-\u{1F3FF}]/gu, '').replace(VS16, '');
      const cp = clean.codePointAt(0);
      if (!cp) return part;
      // Only apply skin tone to human codepoints (people, hands, body parts)
      if (this.isHumanCodepoint(cp)) {
        return String.fromCodePoint(cp) + skinTone;
      }
      return part;
    });
    return result.join(ZWJ);
  }

  private isHumanCodepoint(cp: number): boolean {
    // Ranges: people, hands, gestures, body parts
    return (
      (cp >= 0x1F466 && cp <= 0x1F487) || // boy..haircut
      (cp >= 0x1F4AA && cp <= 0x1F4AA) || // flexed biceps
      (cp >= 0x1F590 && cp <= 0x1F596) || // hand splayed..vulcan
      (cp >= 0x1F645 && cp <= 0x1F64F) || // person gestures, pray
      (cp >= 0x1F6A3 && cp <= 0x1F6A3) || // rowing
      (cp >= 0x1F6B4 && cp <= 0x1F6B6) || // cycling, walking
      (cp >= 0x1F6C0 && cp <= 0x1F6C0) || // bath
      (cp >= 0x1F90C && cp <= 0x1F91F) || // pinched..love you
      (cp >= 0x1F926 && cp <= 0x1F939) || // facepalm..juggling
      (cp >= 0x1F93C && cp <= 0x1F93E) || // wrestling..handball
      (cp >= 0x1F977 && cp <= 0x1F977) || // ninja
      (cp >= 0x1F9B5 && cp <= 0x1F9B6) || // leg, foot
      (cp >= 0x1F9B8 && cp <= 0x1F9B9) || // superhero, villain
      (cp >= 0x1F9BB && cp <= 0x1F9BB) || // ear with hearing aid
      (cp >= 0x1F9CD && cp <= 0x1F9CF) || // standing, kneeling, deaf
      (cp >= 0x1F9D1 && cp <= 0x1F9DD) || // person..elf
      (cp >= 0x1FAC3 && cp <= 0x1FAC5) || // pregnant
      (cp >= 0x1FAF0 && cp <= 0x1FAF8) || // hand gestures
      (cp === 0x261D) ||  // index up
      (cp === 0x270A) ||  // raised fist
      (cp === 0x270B) ||  // raised hand
      (cp === 0x270C) ||  // victory
      (cp === 0x270D) ||  // writing
      (cp === 0x1F385) || // santa
      (cp === 0x1F3C2) || // snowboarder
      (cp === 0x1F3C3) || // runner
      (cp === 0x1F3C4) || // surfer
      (cp === 0x1F3C7) || // horse racing
      (cp === 0x1F3CA) || // swimmer
      (cp === 0x1F3CB) || // weight lifter
      (cp === 0x1F3CC) || // golfer
      (cp === 0x1F442) || // ear
      (cp === 0x1F443) || // nose
      (cp === 0x1F446) || // point up
      (cp === 0x1F447) || // point down
      (cp === 0x1F448) || // point left
      (cp === 0x1F449) || // point right
      (cp === 0x1F44A) || // fist bump
      (cp === 0x1F44B) || // wave
      (cp === 0x1F44C) || // ok
      (cp === 0x1F44D) || // thumbs up
      (cp === 0x1F44E) || // thumbs down
      (cp === 0x1F44F) || // clap
      (cp === 0x1F450) || // open hands
      (cp === 0x1F57A) || // man dancing
      (cp === 0x1F574) || // man in suit levitating
      (cp === 0x1F575) || // detective
      (cp === 0x1F934) || // prince
      (cp === 0x1F936) || // mrs claus
      (cp === 0x1F930) || // pregnant woman
      (cp === 0x1F935)    // person in tuxedo
    );
  }
}
