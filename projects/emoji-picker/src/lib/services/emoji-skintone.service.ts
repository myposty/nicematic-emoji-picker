import { Injectable, signal } from '@angular/core';
import { SkinTone } from '../models/emoji.model';

const STORAGE_KEY = 'nicematic-skintone';
const VALID_TONES: SkinTone[] = ['', '\u{1F3FB}', '\u{1F3FC}', '\u{1F3FD}', '\u{1F3FE}', '\u{1F3FF}'];

@Injectable({ providedIn: 'root' })
export class EmojiSkinToneService {
  readonly currentSkinTone = signal<SkinTone>('');

  constructor() {
    this.load();
  }

  setSkinTone(tone: SkinTone): void {
    this.currentSkinTone.set(tone);
    try {
      localStorage.setItem(STORAGE_KEY, tone);
    } catch {}
  }

  private load(): void {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as SkinTone | null;
      if (stored !== null && VALID_TONES.includes(stored)) {
        this.currentSkinTone.set(stored);
      }
    } catch {}
  }
}
