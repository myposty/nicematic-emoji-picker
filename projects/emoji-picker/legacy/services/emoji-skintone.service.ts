import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SkinTone } from '@nicematic/emoji-picker';

const STORAGE_KEY = 'nicematic-skintone';
const VALID_TONES: SkinTone[] = ['', '\u{1F3FB}', '\u{1F3FC}', '\u{1F3FD}', '\u{1F3FE}', '\u{1F3FF}'];

@Injectable({ providedIn: 'root' })
export class EmojiSkinToneService {
  readonly skinTone$ = new BehaviorSubject<SkinTone>('');

  get currentSkinTone(): SkinTone { return this.skinTone$.value; }

  constructor() { this.load(); }

  setSkinTone(tone: SkinTone): void {
    this.skinTone$.next(tone);
    try { localStorage.setItem(STORAGE_KEY, tone); } catch {}
  }

  private load(): void {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as SkinTone | null;
      if (stored !== null && VALID_TONES.includes(stored)) this.skinTone$.next(stored);
    } catch {}
  }
}
