import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Emoji, SkinTone, SKIN_TONES } from '@nicematic/emoji-picker';
import { EmojiDataService } from '../../services/emoji-data.service';

@Component({
  standalone: false,
  selector: 'nicematic-skin-tone-popover',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="fixed z-50 flex gap-1 p-2 rounded-2xl shadow-2xl select-none"
         style="user-select:none;-webkit-user-select:none;background:var(--nicematic-picker-nav-bg);border:1px solid var(--nicematic-picker-border);"
         [style.left.px]="x" [style.top.px]="y">
      <button *ngFor="let tone of tones" type="button"
        class="w-10 h-10 flex items-center justify-center text-2xl rounded-xl hover:bg-white/10 active:scale-90 transition-all duration-100 cursor-pointer select-none outline-none"
        (click)="toneSelect.emit(tone)">
        {{ getPreview(tone) }}
      </button>
    </div>
  `,
})
export class SkinTonePopoverComponent implements OnInit, OnDestroy {
  @Input() emoji!: Emoji;
  @Input() x = 0;
  @Input() y = 0;
  @Output() toneSelect = new EventEmitter<SkinTone>();
  @Output() close = new EventEmitter<void>();

  readonly tones = SKIN_TONES;
  private clickHandler!: (e: Event) => void;

  constructor(private dataService: EmojiDataService, private elRef: ElementRef) {}

  ngOnInit(): void {
    this.clickHandler = (e: Event) => {
      if (!this.elRef.nativeElement.contains(e.target)) this.close.emit();
    };
    setTimeout(() => document.addEventListener('pointerdown', this.clickHandler), 100);
  }

  ngOnDestroy(): void { document.removeEventListener('pointerdown', this.clickHandler); }

  getPreview(tone: SkinTone): string {
    const base = { ...this.emoji, char: this.emoji.base ?? this.emoji.char };
    return this.dataService.getEmojiWithSkinTone(base, tone);
  }
}
