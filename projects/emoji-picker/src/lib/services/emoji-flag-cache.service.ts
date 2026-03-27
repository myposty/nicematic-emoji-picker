import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class EmojiFlagCacheService {
  private urlCache = new Map<string, string>();
  private preloaded = false;

  getFlag(codepoints: string): string {
    let url = this.urlCache.get(codepoints);
    if (!url) {
      url = `https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/${codepoints}.png`;
      this.urlCache.set(codepoints, url);
    }
    return url;
  }

  preloadFlags(chars: string[]): void {
    if (this.preloaded) return;
    this.preloaded = true;

    requestIdleCallback(() => {
      for (const char of chars) {
        const cp = char.codePointAt(0) || 0;
        if (cp < 0x1F1E6 || cp > 0x1F1FF) continue;
        const codepoints = [...char]
          .map(c => c.codePointAt(0)!.toString(16))
          .filter(c => c !== 'fe0f')
          .join('-');
        const url = this.getFlag(codepoints);
        const img = new Image();
        img.src = url;
      }
    });
  }
}
