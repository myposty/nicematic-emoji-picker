import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { Emoji } from '@nicematic/emoji-picker';

@Component({
  standalone: false,
  selector: 'nicematic-cell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span class="select-none leading-none" [style.font-size.px]="size * 0.62">{{ displayChar }}</span>
  `,
  host: {
    'class': 'inline-flex items-center justify-center cursor-pointer rounded-lg active:scale-90 transition-all duration-100 select-none outline-none nicematic-cell-hover',
    '[style.width]': '"100%"',
    '[style.height.px]': 'size',
    '[style.max-width.px]': 'size',
    'style': 'margin:0 auto;user-select:none;-webkit-user-select:none;touch-action:manipulation;',
    '[attr.aria-label]': 'emoji.name',
    '[title]': 'emoji.name',
    'role': 'button',
    'tabindex': '0',
  },
})
export class EmojiCellComponent implements OnInit, OnDestroy {
  @Input() emoji!: Emoji;
  @Input() displayChar = '';
  @Input() size = 44;
  @Output() emojiClick = new EventEmitter<Emoji>();
  @Output() emojiLongPress = new EventEmitter<{ emoji: Emoji; rect: DOMRect }>();

  private longPressTimer: any = null;
  private didLongPress = false;
  private didMove = false;
  private startX = 0;
  private startY = 0;

  private preventDefault = (e: Event): void => e.preventDefault();

  constructor(private elRef: ElementRef<HTMLElement>) {}

  ngOnInit(): void {
    const el = this.elRef.nativeElement;
    el.addEventListener('pointerdown', this.onStart, { passive: true });
    el.addEventListener('pointermove', this.onMove, { passive: true });
    el.addEventListener('pointerup', this.onEnd, { passive: true });
    el.addEventListener('pointercancel', this.cancel, { passive: true });
    el.addEventListener('pointerleave', this.cancel, { passive: true });
    el.addEventListener('contextmenu', this.preventDefault);
    el.addEventListener('dragstart', this.preventDefault);
  }

  ngOnDestroy(): void {
    this.cancel();
    const el = this.elRef.nativeElement;
    el.removeEventListener('pointerdown', this.onStart);
    el.removeEventListener('pointermove', this.onMove);
    el.removeEventListener('pointerup', this.onEnd);
    el.removeEventListener('pointercancel', this.cancel);
    el.removeEventListener('pointerleave', this.cancel);
    el.removeEventListener('contextmenu', this.preventDefault);
    el.removeEventListener('dragstart', this.preventDefault);
  }

  private onStart = (e: PointerEvent): void => {
    this.startX = e.clientX; this.startY = e.clientY;
    this.didLongPress = false; this.didMove = false;
    if (!this.emoji.hasSkinTone) return;
    this.longPressTimer = setTimeout(() => {
      this.didLongPress = true; this.longPressTimer = null;
      this.emojiLongPress.emit({ emoji: this.emoji, rect: this.elRef.nativeElement.getBoundingClientRect() });
    }, 400);
  };

  private onMove = (e: PointerEvent): void => {
    if (Math.abs(e.clientX - this.startX) > 6 || Math.abs(e.clientY - this.startY) > 6) {
      this.didMove = true; this.cancel();
    }
  };

  private onEnd = (): void => {
    this.cancel();
    if (!this.didLongPress && !this.didMove) this.emojiClick.emit(this.emoji);
    this.didLongPress = false; this.didMove = false;
  };

  private cancel = (): void => {
    if (this.longPressTimer) { clearTimeout(this.longPressTimer); this.longPressTimer = null; }
  };
}
