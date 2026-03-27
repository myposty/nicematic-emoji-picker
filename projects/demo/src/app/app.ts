import { Component, signal } from '@angular/core';
import { EmojiPickerComponent, Emoji } from '@nicematic/emoji-picker';

@Component({
  selector: 'app-root',
  imports: [EmojiPickerComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  selectedEmoji = signal<Emoji | null>(null);
  message = signal('');
  showPicker = signal(true);
  currentLocale = signal<'es' | 'en' | 'pt'>('es');
  copied = signal(false);

  installCmd = 'npm install @nicematic/emoji-picker';

  basicCode = `import { EmojiPickerComponent } from '@nicematic/emoji-picker';

@Component({
  imports: [EmojiPickerComponent],
  template: \`<nicematic-picker (emojiSelect)="onSelect($event)" />\`,
})`;

  configCode = `<nicematic-picker
  [columns]="9"
  [cellSize]="44"
  [locale]="'en'"
  [pickerHeight]="400"
  [pickerWidth]="420"
  [showSearch]="true"
  [showCategories]="true"
  (emojiSelect)="onSelect($event)"
  (pickerClose)="onClose()"
/>`;

  themeCode = `nicematic-picker {
  --nme-bg: #1a1a2e;
  --nme-nav-bg: #16162a;
  --nme-text: #e5e7eb;
  --nme-text-muted: #9ca3af;
  --nme-accent: #3b82f6;
  --nme-hover: rgba(255,255,255,0.1);
  --nme-radius: 16px;
}`;

  onEmojiSelect(emoji: Emoji): void {
    this.message.update(m => m + emoji.char);
    this.selectedEmoji.set(emoji);
  }

  clearMessage(): void {
    this.message.set('');
    this.selectedEmoji.set(null);
  }

  copyInstall(): void {
    navigator.clipboard.writeText(this.installCmd);
    this.copied.set(true);
    setTimeout(() => this.copied.set(false), 2000);
  }

  cycleLocale(): void {
    const locales: ('es' | 'en' | 'pt')[] = ['es', 'en', 'pt'];
    const idx = locales.indexOf(this.currentLocale());
    this.currentLocale.set(locales[(idx + 1) % locales.length]);
  }
}
