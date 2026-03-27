# @nicematic/emoji-picker

A high-performance emoji picker for Angular. Zero external dependencies. Native scroll. Auto theme detection.

**[Live Demo](https://myposty.github.io/nicematic-emoji-picker/)**

## Features

- **929 emojis** across 9 categories (smileys, people, animals, food, travel, activities, objects, symbols, flags)
- **Bilingual search** — English and Spanish keywords built-in
- **Skin tone variants** — long press to choose skin tone
- **Smart recents** — frequency-weighted recency algorithm (like WhatsApp)
- **Flag rendering** — Twemoji fallback for country flags on Windows
- **Zero dependencies** — no CDK, no external libraries, just Angular
- **Angular Signals** — fully reactive with `signal()`, `computed()`, OnPush
- **Standalone component** — tree-shakable, no NgModule needed
- **Auto theme** — detects `prefers-color-scheme` automatically (light/dark)
- **i18n** — category labels in English, Spanish and Portuguese
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

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `columns` | `number` | `9` | Columns in grid (auto-adapts on mobile) |
| `cellSize` | `number` | `44` | Emoji cell size in px |
| `pickerHeight` | `number` | `400` | Picker height in px |
| `pickerWidth` | `number` | `420` | Picker max width in px |
| `locale` | `'en' \| 'es' \| 'pt'` | `'es'` | Category label language |
| `showSearch` | `boolean` | `true` | Show search bar |
| `showCategories` | `boolean` | `true` | Show category tabs |
| `maxRecents` | `number` | `50` | Max recent emojis stored |

### Outputs

| Output | Type | Description |
|--------|------|-------------|
| `emojiSelect` | `Emoji` | Emitted when an emoji is clicked |
| `pickerClose` | `void` | Emitted on click outside or Escape key |

## Theming

The picker auto-detects light/dark mode via `prefers-color-scheme`. To customize colors, override CSS variables:

```css
nicematic-picker {
  --nme-bg: #1a1a2e;
  --nme-nav-bg: #16162a;
  --nme-text: #e5e7eb;
  --nme-text-muted: #9ca3af;
  --nme-border: rgba(255,255,255,0.05);
  --nme-hover: rgba(255,255,255,0.1);
  --nme-input-bg: rgba(255,255,255,0.05);
  --nme-input-border: rgba(255,255,255,0.1);
  --nme-accent: #3b82f6;
  --nme-radius: 16px;
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

- Angular 20+

## License

MIT
