import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
  OnInit,
  OnDestroy,
  ElementRef,
} from '@angular/core';
import { Emoji, SkinTone, SKIN_TONES } from '../../models/emoji.model';
import { EmojiDataService } from '../../services/emoji-data.service';

@Component({
  selector: 'nicematic-skin-tone-popover',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="fixed z-50 flex gap-1 p-2 rounded-2xl shadow-2xl select-none"
         style="user-select:none;-webkit-user-select:none;-webkit-user-drag:none;background:var(--nme-nav-bg);border:1px solid var(--nme-border);"
         (dragstart)="$event.preventDefault()"
         [style.left.px]="x()"
         [style.top.px]="y()">
      @for (tone of tones; track tone) {
        <button
          type="button"
          class="w-10 h-10 flex items-center justify-center text-2xl rounded-xl hover:bg-white/10 active:scale-90 transition-all duration-100 cursor-pointer select-none outline-none"
          (click)="onSelect(tone)"
          [attr.aria-label]="'Skin tone ' + $index"
        >
          {{ getPreview(tone) }}
        </button>
      }
    </div>
  `,
})
export class SkinTonePopoverComponent implements OnInit, OnDestroy {
  readonly emoji = input.required<Emoji>();
  readonly x = input<number>(0);
  readonly y = input<number>(0);

  readonly toneSelect = output<SkinTone>();
  readonly close = output<void>();

  readonly tones = SKIN_TONES;

  private clickOutsideHandler!: (e: Event) => void;

  constructor(
    private dataService: EmojiDataService,
    private elRef: ElementRef,
  ) {}

  ngOnInit(): void {
    this.clickOutsideHandler = (e: Event) => {
      if (!this.elRef.nativeElement.contains(e.target)) {
        this.close.emit();
      }
    };
    setTimeout(() => {
      document.addEventListener('pointerdown', this.clickOutsideHandler);
    }, 100);
  }

  ngOnDestroy(): void {
    document.removeEventListener('pointerdown', this.clickOutsideHandler);
  }

  getPreview(tone: SkinTone): string {
    const base = { ...this.emoji(), char: this.emoji().base ?? this.emoji().char };
    return this.dataService.getEmojiWithSkinTone(base, tone);
  }


  onSelect(tone: SkinTone): void {
    this.toneSelect.emit(tone);
  }
}
