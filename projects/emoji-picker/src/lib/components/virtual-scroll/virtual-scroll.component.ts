import {
  Component,
  ChangeDetectionStrategy,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
  computed,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'emoji-virtual-scroll',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      #scrollContainer
      class="virtual-scroll-viewport"
      [style.height.px]="viewportHeight"
      [style.overflow]="'auto'"
      [style.position]="'relative'"
    >
      <div
        class="virtual-scroll-spacer"
        [style.height.px]="totalHeight()"
        [style.width.%]="100"
        [style.pointer-events]="'none'"
      ></div>
      <div
        class="virtual-scroll-content"
        [style.position]="'absolute'"
        [style.top.px]="0"
        [style.left.px]="0"
        [style.width.%]="100"
        [style.transform]="'translateY(' + offsetY() + 'px)'"
      >
        <div class="virtual-scroll-row" [style.display]="'flex'" [style.flex-wrap]="'wrap'">
          @for (item of visibleItems(); track $index) {
            @if (itemTemplate) {
              <ng-container
                [ngTemplateOutlet]="itemTemplate"
                [ngTemplateOutletContext]="{ $implicit: item, index: visibleStartIndex() + $index }"
              ></ng-container>
            } @else {
              <div
                [style.width.px]="itemWidth()"
                [style.height.px]="itemHeight"
                [style.display]="'flex'"
                [style.align-items]="'center'"
                [style.justify-content]="'center'"
              >
                {{ item }}
              </div>
            }
          }
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }
      .virtual-scroll-viewport {
        will-change: scroll-position;
      }
      .virtual-scroll-content {
        will-change: transform;
      }
    `,
  ],
})
export class VirtualScrollComponent implements OnInit, OnDestroy {
  @Input() items: any[] = [];
  @Input() itemHeight = 40;
  @Input() columns = 9;
  @Input() viewportHeight = 300;
  @Input() bufferRows = 3;
  @Input() itemTemplate: TemplateRef<any> | null = null;

  @ViewChild('scrollContainer', { static: true })
  scrollContainerRef!: ElementRef<HTMLElement>;

  readonly scrollTop = signal(0);

  private rafId: number | null = null;
  private scrollHandler!: () => void;

  readonly totalRows = computed(() => Math.ceil(this.items.length / this.columns));
  readonly totalHeight = computed(() => this.totalRows() * this.itemHeight);

  readonly visibleStartRow = computed(() => {
    const start = Math.floor(this.scrollTop() / this.itemHeight) - this.bufferRows;
    return Math.max(0, start);
  });

  readonly visibleEndRow = computed(() => {
    const viewportRows = Math.ceil(this.viewportHeight / this.itemHeight);
    const scrollRow = Math.floor(this.scrollTop() / this.itemHeight);
    const end = scrollRow + viewportRows + this.bufferRows;
    return Math.min(this.totalRows(), end);
  });

  readonly visibleStartIndex = computed(() => this.visibleStartRow() * this.columns);

  readonly visibleItems = computed(() => {
    const start = this.visibleStartRow() * this.columns;
    const end = this.visibleEndRow() * this.columns;
    return this.items.slice(start, end);
  });

  readonly offsetY = computed(() => this.visibleStartRow() * this.itemHeight);

  readonly itemWidth = computed(() => {
    // Returns a rough per-item width; consumers should style via template.
    return 100 / this.columns;
  });

  ngOnInit(): void {
    const el = this.scrollContainerRef.nativeElement;

    this.scrollHandler = () => {
      if (this.rafId !== null) return;
      this.rafId = requestAnimationFrame(() => {
        this.rafId = null;
        this.scrollTop.set(el.scrollTop);
      });
    };

    el.addEventListener('scroll', this.scrollHandler, { passive: true });
  }

  ngOnDestroy(): void {
    this.scrollContainerRef?.nativeElement.removeEventListener('scroll', this.scrollHandler);
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
    }
  }
}
