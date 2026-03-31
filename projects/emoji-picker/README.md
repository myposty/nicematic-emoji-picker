# @nicematic/emoji-picker

A high-performance emoji picker for Angular. Zero external dependencies. Native scroll. Auto theme detection.

**[Live Demo](https://myposty.github.io/nicematic-emoji-picker/)**

## Features

- **965 emojis** across 9 categories including Unicode 16.0 and 17.0
- **22 languages** — locale-aware search with native keywords (ES, EN, PT, FR, DE, IT, JA, KO, ZH, RU, AR, HI, TR, PL, NL, SV, DA, UK, TH, VI, ID, MS)
- **Skin tone variants** — long press to choose skin tone
- **Smart recents** — frequency-weighted recency algorithm (like WhatsApp)
- **Flag rendering** — Twemoji fallback for country flags on Windows
- **Zero dependencies** — no CDK, no external libraries, just Angular
- **Angular Signals** — fully reactive with `signal()`, `computed()`, OnPush
- **Standalone component** — tree-shakable, no NgModule needed
- **Auto theme** — detects `prefers-color-scheme` automatically (light/dark)
- **i18n** — category labels and search keywords in 22 languages
- **Responsive** — adapts columns dynamically to container width
- **CSS Variables** — fully customizable colors
- **Styles included** — Tailwind CSS precompiled inside the library, zero config needed

## Installation

```bash
npm install @nicematic/emoji-picker
```

## Usage

```typescript
import { EmojiPickerComponent, Emoji } from '@nicematic/emoji-picker';

@Component({
  selector: 'app-root',
  imports: [EmojiPickerComponent],
  template: `
    <nicematic-picker (emojiSelect)="onSelect($event)" />
  `,
})
export class App {
  onSelect(emoji: Emoji) {
    console.log(emoji.char); // 😀
  }
}
```

That's it. No extra styles, no Tailwind config, no setup needed.

## Configuration

All inputs are optional. Defaults work out of the box.

```html
<nicematic-picker
  [columns]="9"
  [cellSize]="44"
  [pickerHeight]="400"
  [pickerWidth]="420"
  [locale]="'en'"
  [showSearch]="true"
  [showCategories]="true"
  (emojiSelect)="onSelect($event)"
  (pickerClose)="onClose()"
/>
```

### Inputs

| Input | Type | Default | Range | Description |
|-------|------|---------|-------|-------------|
| `columns` | `number` | `9` | 3 - 15 | Columns in grid (auto-adapts on mobile) |
| `cellSize` | `number` | `44` | 24 - 64 | Emoji cell size in px |
| `pickerHeight` | `number` | `400` | 200 - 800 | Picker height in px |
| `pickerWidth` | `number` | `420` | 200 - 800 | Picker max width in px |
| `locale` | `string` | `'en'` | — | UI labels and search language (en, es, pt, fr, de, it, ja, ko, zh, ru, ar, hi, tr, pl, nl, sv, da, uk, th, vi, id, ms) |
| `showSearch` | `boolean` | `true` | — | Show search bar |
| `showCategories` | `boolean` | `true` | — | Show category tabs |
| `maxRecents` | `number` | `10` | 0 - 36 | Max recent emojis stored |

> Values outside the allowed range are automatically clamped to the nearest limit.

### Outputs

| Output | Type | Description |
|--------|------|-------------|
| `emojiSelect` | `Emoji` | Emitted when an emoji is clicked |
| `pickerClose` | `void` | Emitted on click outside or Escape key |

## Theming

The picker auto-detects light/dark mode via `prefers-color-scheme`. To customize colors, override CSS variables:

```css
nicematic-picker {
  --nicematic-picker-bg: #1a1a2e;
  --nicematic-picker-nav-bg: #16162a;
  --nicematic-picker-text: #e5e7eb;
  --nicematic-picker-text-muted: #9ca3af;
  --nicematic-picker-border: rgba(255,255,255,0.05);
  --nicematic-picker-hover: rgba(255,255,255,0.1);
  --nicematic-picker-input-bg: rgba(255,255,255,0.05);
  --nicematic-picker-input-border: rgba(255,255,255,0.1);
  --nicematic-picker-accent: #3b82f6;
  --nicematic-picker-radius: 16px;
}
```

## Emoji Interface

```typescript
interface Emoji {
  char: string;
  name: string;
  keywords: string[];
  category: EmojiCategory;
  hasSkinTone: boolean;
}

type EmojiCategory = 'recent' | 'smileys' | 'people' | 'animals' | 'food'
  | 'travel' | 'activities' | 'objects' | 'symbols' | 'flags';
```

## Exported Services

All services are `providedIn: 'root'` and can be injected directly:

- `EmojiDataService` — access all emoji data
- `EmojiSearchService` — programmatic search
- `EmojiRecentsService` — manage recent emojis
- `EmojiSkinToneService` — get/set skin tone preference

## Requirements

- Angular 17.1+

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for release history.

## License

Nicematic License v1.0 — Free to use, no forks or redistribution allowed. See [LICENSE](LICENSE) for details.
