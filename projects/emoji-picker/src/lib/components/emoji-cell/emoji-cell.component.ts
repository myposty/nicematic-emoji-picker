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
    'class': 'inline-flex items-center justify-center cursor-pointer rounded-lg active:scale-90 transition-all duration-100 select-none outline-none nme-cell',
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
  private startX = 0;
  private startY = 0;
  private readonly MOVE_THRESHOLD = 10;
  private readonly LONG_PRESS_MS = 400;

  constructor(
    private elRef: ElementRef<HTMLElement>,
    private flagCache: EmojiFlagCacheService,
  ) {}

  ngOnInit(): void {
    const el = this.elRef.nativeElement;

    // Pointer events (desktop + modern mobile)
    if (window.PointerEvent) {
      el.addEventListener('pointerdown', this.onStart, { passive: true });
      el.addEventListener('pointermove', this.onMove, { passive: true });
      el.addEventListener('pointerup', this.onEnd, { passive: true });
      el.addEventListener('pointercancel', this.cancelLongPress, { passive: true });
      el.addEventListener('pointerleave', this.cancelLongPress, { passive: true });
    }

    // Touch events (fallback iOS Safari, old Android)
    el.addEventListener('touchstart', this.onTouchStart, { passive: false });
    el.addEventListener('touchmove', this.onTouchMove, { passive: true });
    el.addEventListener('touchend', this.onTouchEnd, { passive: true });
    el.addEventListener('touchcancel', this.cancelLongPress, { passive: true });

    // Prevent native long press behaviors
    el.addEventListener('contextmenu', (e: Event) => e.preventDefault());
    el.addEventListener('dragstart', (e: Event) => e.preventDefault());

    // Prevent iOS callout / text selection
    (el.style as any).webkitTouchCallout = 'none';
    (el.style as any).webkitUserSelect = 'none';
    (el.style as any).touchAction = 'manipulation';
  }

  ngOnDestroy(): void {
    this.cancelLongPress();
  }

  private onStart = (e: PointerEvent): void => {
    this.startX = e.clientX;
    this.startY = e.clientY;
    this.startLongPress();
  };

  private onMove = (e: PointerEvent): void => {
    if (!this.longPressTimer) return;
    const dx = Math.abs(e.clientX - this.startX);
    const dy = Math.abs(e.clientY - this.startY);
    if (dx > this.MOVE_THRESHOLD || dy > this.MOVE_THRESHOLD) {
      this.cancelLongPress();
    }
  };

  private onEnd = (): void => {
    if (this.longPressTimer) {
      clearTimeout(this.longPressTimer);
      this.longPressTimer = null;
    }
    if (!this.didLongPress) {
      this.emojiClick.emit(this.emoji());
    }
    this.didLongPress = false;
  };

  private onTouchStart = (e: TouchEvent): void => {
    if (this.emoji().hasSkinTone) {
      e.preventDefault(); // Prevent iOS magnifying glass / text selection
    }
    const touch = e.touches[0];
    this.startX = touch.clientX;
    this.startY = touch.clientY;
    this.startLongPress();
  };

  private onTouchMove = (e: TouchEvent): void => {
    if (!this.longPressTimer) return;
    const touch = e.touches[0];
    const dx = Math.abs(touch.clientX - this.startX);
    const dy = Math.abs(touch.clientY - this.startY);
    if (dx > this.MOVE_THRESHOLD || dy > this.MOVE_THRESHOLD) {
      this.cancelLongPress();
    }
  };

  private onTouchEnd = (): void => {
    this.onEnd();
  };

  private startLongPress(): void {
    this.didLongPress = false;
    if (!this.emoji().hasSkinTone) return;
    this.longPressTimer = setTimeout(() => {
      this.didLongPress = true;
      this.longPressTimer = null;
      const rect = this.elRef.nativeElement.getBoundingClientRect();
      this.emojiLongPress.emit({ emoji: this.emoji(), rect });
    }, this.LONG_PRESS_MS);
  }

  private cancelLongPress = (): void => {
    if (this.longPressTimer) {
      clearTimeout(this.longPressTimer);
      this.longPressTimer = null;
    }
  };
}
