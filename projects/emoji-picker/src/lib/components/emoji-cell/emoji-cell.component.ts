import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
  computed,
  ElementRef,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Emoji } from '../../models/emoji.model';
import { EmojiFlagCacheService } from '../../services/emoji-flag-cache.service';

@Component({
  selector: 'nicematic-cell',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'class': 'inline-flex items-center justify-center cursor-pointer rounded-lg hover:bg-white/10 active:scale-90 transition-all duration-100 select-none outline-none',
    '[style.user-select]': '"none"',
    '[style.-webkit-user-select]': '"none"',
    '[style.content-visibility]': '"auto"',
    '[style.contain-intrinsic-size]': 'size() + "px"',
    '[style.width.px]': 'size()',
    '[style.height.px]': 'size()',
    'role': 'button',
    '[attr.aria-label]': 'emoji().name',
    '[title]': 'emoji().name',
    'tabindex': '0',
    '(keydown.enter)': 'emojiClick.emit(emoji())',
    '(keydown.space)': 'emojiClick.emit(emoji())',
  },
  template: `
    @if (isFlag()) {
      <img
        [src]="flagUrl()"
        [alt]="emoji().name"
        class="select-none pointer-events-none"
        draggable="false"
        loading="lazy"
        [style.width.px]="size() * 0.62"
        [style.height.px]="size() * 0.62"
      />
    } @else {
      <span class="select-none leading-none" [style.font-size.px]="size() * 0.62">{{ displayChar() }}</span>
    }
  `,
})
export class EmojiCellComponent implements OnInit, OnDestroy {
  readonly emoji = input.required<Emoji>();
  readonly displayChar = input.required<string>();
  readonly size = input<number>(44);

  readonly emojiClick = output<Emoji>();
  readonly emojiLongPress = output<{ emoji: Emoji; rect: DOMRect }>();

  readonly isFlag = computed(() => {
    const char = this.displayChar();
    const cp = char.codePointAt(0) || 0;
    return cp >= 0x1F1E6 && cp <= 0x1F1FF;
  });

  readonly flagUrl = computed(() => {
    if (!this.isFlag()) return '';
    const char = this.displayChar();
    const codepoints = [...char]
      .map(c => c.codePointAt(0)!.toString(16))
      .filter(cp => cp !== 'fe0f')
      .join('-');
    return this.flagCache.getFlag(codepoints);
  });

  private longPressTimer: ReturnType<typeof setTimeout> | null = null;
  private didLongPress = false;

  constructor(
    private elRef: ElementRef<HTMLElement>,
    private flagCache: EmojiFlagCacheService,
  ) {}

  ngOnInit(): void {
    const el = this.elRef.nativeElement;
    el.addEventListener('pointerdown', this.onPointerDown, { passive: true });
    el.addEventListener('pointerup', this.onPointerUp, { passive: true });
    el.addEventListener('pointerleave', this.cancelLongPress, { passive: true });
    el.addEventListener('contextmenu', (e: Event) => e.preventDefault());
    el.addEventListener('dragstart', (e: Event) => e.preventDefault());
  }

  ngOnDestroy(): void {
    this.cancelLongPress();
    const el = this.elRef.nativeElement;
    el.removeEventListener('pointerdown', this.onPointerDown);
    el.removeEventListener('pointerup', this.onPointerUp);
    el.removeEventListener('pointerleave', this.cancelLongPress);
  }

  private onPointerDown = (): void => {
    this.didLongPress = false;
    if (this.emoji().hasSkinTone) {
      this.longPressTimer = setTimeout(() => {
        this.didLongPress = true;
        const rect = this.elRef.nativeElement.getBoundingClientRect();
        this.emojiLongPress.emit({ emoji: this.emoji(), rect });
      }, 500);
    }
  };

  private onPointerUp = (): void => {
    if (this.longPressTimer) {
      clearTimeout(this.longPressTimer);
      this.longPressTimer = null;
    }
    if (!this.didLongPress) {
      this.emojiClick.emit(this.emoji());
    }
    this.didLongPress = false;
  };

  private cancelLongPress = (): void => {
    if (this.longPressTimer) {
      clearTimeout(this.longPressTimer);
      this.longPressTimer = null;
    }
  };
}
