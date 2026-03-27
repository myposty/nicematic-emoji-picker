import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class EmojiFlagCacheService {
  private cache = new Map<string, string>();
  private pending = new Map<string, Promise<string>>();

  getFlag(codepoints: string): string | null {
    return this.cache.get(codepoints) ?? null;
  }

  async loadFlag(codepoints: string): Promise<string> {
    const cached = this.cache.get(codepoints);
    if (cached) return cached;

    const existing = this.pending.get(codepoints);
    if (existing) return existing;

    const url = `https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/${codepoints}.png`;
    const promise = fetch(url)
      .then(res => res.blob())
      .then(blob => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const dataUrl = reader.result as string;
            this.cache.set(codepoints, dataUrl);
            this.pending.delete(codepoints);
            resolve(dataUrl);
          };
          reader.readAsDataURL(blob);
        });
      })
      .catch(() => {
        this.pending.delete(codepoints);
        return '';
      });

    this.pending.set(codepoints, promise);
    return promise;
  }
}
