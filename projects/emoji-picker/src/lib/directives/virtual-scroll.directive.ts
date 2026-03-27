import {
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';

export interface VirtualScrollRange {
  start: number;
  end: number;
}

@Directive({
  selector: '[emojiVirtualScroll]',
  standalone: true,
})
export class VirtualScrollDirective implements OnInit, OnChanges, OnDestroy {
  @Input() itemHeight = 40;
  @Input() totalItems = 0;
  @Input() bufferSize = 3;

  @Output() visibleRange = new EventEmitter<VirtualScrollRange>();

  private spacer: HTMLDivElement | null = null;
  private rafId: number | null = null;
  private scrollHandler: () => void;
  private lastEmitted: VirtualScrollRange = { start: -1, end: -1 };

  constructor(private el: ElementRef<HTMLElement>) {
    this.scrollHandler = () => {
      if (this.rafId !== null) return;
      this.rafId = requestAnimationFrame(() => {
        this.rafId = null;
        this.calculate();
      });
    };
  }

  ngOnInit(): void {
    const host = this.el.nativeElement;
    host.style.overflow = 'auto';
    host.style.position = 'relative';

    this.spacer = document.createElement('div');
    this.spacer.style.width = '100%';
    this.spacer.style.pointerEvents = 'none';
    this.spacer.style.position = 'relative';
    host.prepend(this.spacer);

    host.addEventListener('scroll', this.scrollHandler, { passive: true });

    this.updateSpacer();
    this.calculate();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['totalItems'] || changes['itemHeight']) {
      this.updateSpacer();
      this.calculate();
    }
  }

  ngOnDestroy(): void {
    this.el.nativeElement.removeEventListener('scroll', this.scrollHandler);
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
    }
    this.spacer?.remove();
  }

  private updateSpacer(): void {
    if (!this.spacer) return;
    const totalHeight = this.totalItems * this.itemHeight;
    this.spacer.style.height = `${totalHeight}px`;
  }

  private calculate(): void {
    const host = this.el.nativeElement;
    const scrollTop = host.scrollTop;
    const viewportHeight = host.clientHeight;

    const startRow = Math.floor(scrollTop / this.itemHeight);
    const visibleRows = Math.ceil(viewportHeight / this.itemHeight);

    const start = Math.max(0, startRow - this.bufferSize);
    const end = Math.min(this.totalItems, startRow + visibleRows + this.bufferSize);

    if (start !== this.lastEmitted.start || end !== this.lastEmitted.end) {
      this.lastEmitted = { start, end };
      this.visibleRange.emit({ start, end });
    }
  }
}
