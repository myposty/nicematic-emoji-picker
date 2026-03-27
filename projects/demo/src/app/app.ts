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

  onEmojiSelect(emoji: Emoji): void {
    this.message.update(m => m + emoji.char);
    this.selectedEmoji.set(emoji);
  }

  clearMessage(): void {
    this.message.set('');
    this.selectedEmoji.set(null);
  }
}
