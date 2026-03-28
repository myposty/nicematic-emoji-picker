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
  currentLocale = signal<string>('es');
  locales = ['es','en','pt','fr','de','it','ja','ko','zh','ru','ar','hi'];
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
  --nicematic-picker-bg: #1a1a2e;
  --nicematic-picker-nav-bg: #16162a;
  --nicematic-picker-text: #e5e7eb;
  --nicematic-picker-text-muted: #9ca3af;
  --nicematic-picker-accent: #3b82f6;
  --nicematic-picker-hover: rgba(255,255,255,0.1);
  --nicematic-picker-radius: 16px;
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

}
