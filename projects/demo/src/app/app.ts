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
  currentLocale = signal<string>('es');
  currentTab = signal<'playground' | 'modern' | 'legacy'>('playground');
  copied = signal(false);
  locales = ['es','en','pt','fr','de','it','ja','ko','zh','ru','ar','hi'];

  installCmd = 'npm install @nicematic/emoji-picker';

  modernCode = `// Angular 17+ (standalone)
import { EmojiPickerComponent } from '@nicematic/emoji-picker';

@Component({
  standalone: true,
  imports: [EmojiPickerComponent],
  template: \`
    <nicematic-picker
      [locale]="'es'"
      (emojiSelect)="onSelect($event)"
      (pickerClose)="onClose()"
    />
  \`,
})
export class MyComponent {
  onSelect(emoji: Emoji) {
    console.log(emoji.char);
  }
}`;

  legacyCode = `// Angular 14-16 (NgModule)
import { EmojiPickerModule } from '@nicematic/emoji-picker/legacy';

@NgModule({
  imports: [EmojiPickerModule],
})
export class AppModule {}

// In your component template:
// <nicematic-picker
//   [columns]="9"
//   [cellSize]="44"
//   [locale]="'es'"
//   [pickerHeight]="400"
//   [pickerWidth]="420"
//   [maxRecents]="10"
//   [showSearch]="true"
//   [showCategories]="true"
//   (emojiSelect)="onSelect($event)"
//   (pickerClose)="onClose()"
// ></nicematic-picker>`;

  configCode = `<nicematic-picker
  [columns]="9"         <!-- 3 to 15 -->
  [cellSize]="44"       <!-- 24 to 64 -->
  [locale]="'en'"       <!-- es,en,pt,fr,de,it,ja,ko,zh,ru,ar,hi -->
  [pickerHeight]="400"  <!-- 200 to 800 -->
  [pickerWidth]="420"   <!-- 200 to 800 -->
  [maxRecents]="10"     <!-- 0 to 36 -->
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
  --nicematic-picker-border: rgba(255,255,255,0.05);
  --nicematic-picker-hover: rgba(255,255,255,0.1);
  --nicematic-picker-input-bg: rgba(255,255,255,0.05);
  --nicematic-picker-input-border: rgba(255,255,255,0.1);
  --nicematic-picker-accent: #3b82f6;
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

  copyText(text: string): void {
    navigator.clipboard.writeText(text);
    this.copied.set(true);
    setTimeout(() => this.copied.set(false), 2000);
  }
}
