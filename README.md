# @nicematic/emoji-picker

A high-performance emoji picker for Angular. Zero external dependencies. Virtual scroll. Tailwind v4.

## Features

- **738 emojis** across 9 categories (smileys, people, animals, food, travel, activities, objects, symbols, flags)
- **Virtual scroll** — only renders visible rows, handles 700+ emojis smoothly
- **Bilingual search** — English and Spanish keywords built-in
- **Skin tone variants** — long press on any supported emoji to choose skin tone
- **Smart recents** — frequency-weighted recency algorithm (like WhatsApp)
- **Flag rendering** — Twemoji fallback for country flags on Windows
- **Zero dependencies** — no CDK, no external libraries, just Angular
- **Angular Signals** — fully reactive with `signal()`, `computed()`, OnPush
- **Standalone components** — tree-shakable, no NgModule needed
- **Tailwind v4** — dark UI out of the box
- **Dynamic height** — picker adjusts automatically based on content

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
    <nme-emoji-picker (emojiSelect)="onSelect($event)" />
  `,
})
export class App {
  onSelect(emoji: Emoji) {
    console.log(emoji.char); // 😀
  }
}
```

## Configuration

All inputs are optional. Defaults work out of the box.

```html
<nme-emoji-picker
  [columns]="9"
  [cellSize]="44"
  [pickerHeight]="400"
  [pickerWidth]="420"
  [showSearch]="true"
  [showCategories]="true"
  (emojiSelect)="onSelect($event)"
/>
```

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `columns` | `number` | `9` | Number of columns in the grid |
| `cellSize` | `number` | `44` | Size of each emoji cell in px |
| `pickerHeight` | `number` | `400` | Max height of the picker in px |
| `pickerWidth` | `number` | `420` | Width of the picker in px |
| `showSearch` | `boolean` | `true` | Show/hide search bar |
| `showCategories` | `boolean` | `true` | Show/hide category tabs |
| `maxRecents` | `number` | `50` | Max recent emojis stored |

| Output | Type | Description |
|--------|------|-------------|
| `emojiSelect` | `Emoji` | Emitted when an emoji is clicked |

## Tailwind v4 Setup

The picker uses Tailwind classes. Add the source path in your `styles.css`:

```css
@import "tailwindcss";
@source "../node_modules/@nicematic/emoji-picker/**/*.ts";
```

## Emoji Interface

```typescript
interface Emoji {
  char: string;        // Unicode character
  name: string;        // English name
  keywords: string[];  // Search keywords
  category: EmojiCategory;
  hasSkinTone: boolean;
}
```

## Requirements

- Angular 20+
- Tailwind CSS v4

## License

MIT
