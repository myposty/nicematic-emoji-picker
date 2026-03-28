import { Injectable, signal } from '@angular/core';
import { Emoji } from '../models/emoji.model';

interface RecentEntry {
  char: string;
  name: string;
  keywords: string[];
  category: Emoji['category'];
  hasSkinTone: boolean;
  base?: string;
  count: number;
  lastUsed: number;
}

const STORAGE_KEY = 'nicematic-recents';
const MAX_RECENTS = 10;
const DECAY_HALF_LIFE = 3 * 24 * 60 * 60 * 1000; // 3 days in ms

@Injectable({ providedIn: 'root' })
export class EmojiRecentsService {
  readonly recents = signal<Emoji[]>([]);

  private entries: RecentEntry[] = [];

  constructor() {
    this.load();
  }

  addRecent(emoji: Emoji): void {
    const now = Date.now();
    const existing = this.entries.find(e => e.char === emoji.char);

    if (existing) {
      existing.count++;
      existing.lastUsed = now;
    } else {
      this.entries.push({
        char: emoji.char,
        name: emoji.name,
        keywords: emoji.keywords,
        category: emoji.category,
        hasSkinTone: emoji.hasSkinTone,
        base: emoji.base,
        count: 1,
        lastUsed: now,
      });
    }

    this.sortAndTrim(now);
    this.persist();
    this.updateSignal();
  }

  clearRecents(): void {
    this.entries = [];
    this.persist();
    this.updateSignal();
  }

  private sortAndTrim(now: number): void {
    this.entries.sort((a, b) => this.score(b, now) - this.score(a, now));
    if (this.entries.length > MAX_RECENTS) {
      this.entries.length = MAX_RECENTS;
    }
  }

  private score(entry: RecentEntry, now: number): number {
    const age = now - entry.lastUsed;
    const recencyWeight = Math.pow(0.5, age / DECAY_HALF_LIFE);
    return entry.count * recencyWeight;
  }

  private persist(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.entries));
    } catch {}
  }

  private load(): void {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        this.entries = JSON.parse(raw);
        this.sortAndTrim(Date.now());
        this.updateSignal();
      }
    } catch {
      this.entries = [];
    }
  }

  private updateSignal(): void {
    this.recents.set(
      this.entries.map(e => ({
        char: e.char,
        name: e.name,
        keywords: e.keywords,
        category: e.category,
        hasSkinTone: e.hasSkinTone,
        ...(e.base ? { base: e.base } : {}),
      }))
    );
  }
}
