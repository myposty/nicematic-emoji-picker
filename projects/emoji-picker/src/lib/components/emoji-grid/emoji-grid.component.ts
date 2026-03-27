import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
  computed,
  signal,
  ElementRef,
  ViewChild,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { Emoji, EmojiCategory, CategoryMeta, SkinTone } from '../../models/emoji.model';
import { EmojiCellComponent } from '../emoji-cell/emoji-cell.component';
import { SkinTonePopoverComponent } from '../skin-tone-popover/skin-tone-popover.component';
import { EmojiDataService } from '../../services/emoji-data.service';

interface GridRow {
  type: 'header' | 'emojis';
  category?: CategoryMeta;
  emojis?: Emoji[];
  displayChars?: string[];
}

@Component({
  selector: 'nicematic-grid',
  standalone: true,
  imports: [EmojiCellComponent, SkinTonePopoverComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      #scrollContainer
      class="overflow-y-scroll overflow-x-hidden relative"
      style="scrollbar-width: none;"
      [style.height.px]="effectiveHeight()"
    >
      <div [style.height.px]="totalHeight() + 12" class="w-full pointer-events-none"></div>

      @if (isSearchMode() && emojis().length === 0) {
        <div class="absolute inset-0 flex flex-col items-center justify-center gap-2 text-gray-500">
          <span class="text-4xl">😕</span>
          <span class="text-sm">No se encontraron emojis</span>
        </div>
      }

      <div class="absolute top-0 left-0 w-full" [style.transform]="'translateY(' + offsetY() + 'px)'">
        @for (row of visibleRows(); track $index) {
          @if (row.type === 'header') {
            <div
              class="flex items-center px-4 text-[13px] font-bold text-gray-300/90 tracking-wide"
              [style.height.px]="headerHeight"
            >
              {{ row.category!.label }}
            </div>
          } @else {
            <div class="flex flex-wrap px-2" [style.min-height.px]="cellSize()">
              @for (emoji of row.emojis; track emoji.char; let i = $index) {
                <nicematic-cell
                  [emoji]="emoji"
                  [displayChar]="row.displayChars![i]"
                  [size]="cellSize()"
                  (emojiClick)="emojiSelect.emit($event)"
                  (emojiLongPress)="onLongPress($event.emoji, $event.rect)"
                />
              }
            </div>
          }
        }
      </div>

      <!-- Skin tone popover -->
      @if (skinToneEmoji()) {
        <nicematic-skin-tone-popover
          [emoji]="skinToneEmoji()!"
          [x]="popoverX()"
          [y]="popoverY()"
          (toneSelect)="onToneSelected($event)"
          (close)="skinToneEmoji.set(null)"
        />
      }
    </div>
  `,
})
export class EmojiGridComponent implements OnInit, OnDestroy {
  readonly emojis = input.required<Emoji[]>();
  readonly categories = input.required<CategoryMeta[]>();
  readonly skinTone = input<SkinTone>('');
  readonly columns = input<number>(9);
  readonly cellSize = input<number>(36);
  readonly height = input<number>(300);
  readonly contentHeight = input<number>(0);
  readonly isSearchMode = input<boolean>(false);

  readonly effectiveHeight = computed(() => {
    const ch = this.contentHeight();
    const h = this.height();
    return ch > 0 ? Math.min(h, ch) : h;
  });

  readonly emojiSelect = output<Emoji>();
  readonly categoryVisible = output<EmojiCategory>();

  @ViewChild('scrollContainer', { static: true })
  scrollContainerRef!: ElementRef<HTMLElement>;

  readonly headerHeight = 28;
  readonly scrollTop = signal(0);
  readonly skinToneEmoji = signal<Emoji | null>(null);
  readonly popoverX = signal(0);
  readonly popoverY = signal(0);

  private rafId: number | null = null;
  private scrollHandler!: () => void;

  constructor(private dataService: EmojiDataService) {}

  readonly allRows = computed<GridRow[]>(() => {
    const emojis = this.emojis();
    const cols = this.columns();
    const tone = this.skinTone();
    const rows: GridRow[] = [];

    if (this.isSearchMode()) {
      for (let i = 0; i < emojis.length; i += cols) {
        const chunk = emojis.slice(i, i + cols);
        rows.push({
          type: 'emojis',
          emojis: chunk,
          displayChars: chunk.map(e => this.dataService.getEmojiWithSkinTone(e, tone)),
        });
      }
      return rows;
    }

    const cats = this.categories();
    const grouped = new Map<EmojiCategory, Emoji[]>();
    for (const emoji of emojis) {
      const list = grouped.get(emoji.category);
      if (list) list.push(emoji);
      else grouped.set(emoji.category, [emoji]);
    }

    for (const cat of cats) {
      const catEmojis = grouped.get(cat.id);
      if (!catEmojis?.length) continue;

      rows.push({ type: 'header', category: cat });

      for (let i = 0; i < catEmojis.length; i += cols) {
        const chunk = catEmojis.slice(i, i + cols);
        rows.push({
          type: 'emojis',
          emojis: chunk,
          displayChars: chunk.map(e => this.dataService.getEmojiWithSkinTone(e, tone)),
        });
      }
    }
    return rows;
  });

  readonly totalHeight = computed(() => {
    let h = 0;
    for (const row of this.allRows()) {
      h += row.type === 'header' ? this.headerHeight : this.cellSize();
    }
    return h;
  });

  readonly visibleStartIdx = computed(() => {
    const st = this.scrollTop();
    const rows = this.allRows();
    let acc = 0;
    for (let i = 0; i < rows.length; i++) {
      const rh = rows[i].type === 'header' ? this.headerHeight : this.cellSize();
      if (acc + rh > st) return Math.max(0, i - 2);
      acc += rh;
    }
    return Math.max(0, rows.length - 1);
  });

  readonly visibleEndIdx = computed(() => {
    const st = this.scrollTop();
    const h = this.effectiveHeight();
    const rows = this.allRows();
    let acc = 0;
    for (let i = 0; i < rows.length; i++) {
      const rh = rows[i].type === 'header' ? this.headerHeight : this.cellSize();
      acc += rh;
      if (acc > st + h) return Math.min(rows.length, i + 3);
    }
    return rows.length;
  });

  readonly offsetY = computed(() => {
    const rows = this.allRows();
    const start = this.visibleStartIdx();
    let y = 0;
    for (let i = 0; i < start; i++) {
      y += rows[i].type === 'header' ? this.headerHeight : this.cellSize();
    }
    return y;
  });

  readonly visibleRows = computed(() => {
    return this.allRows().slice(this.visibleStartIdx(), this.visibleEndIdx());
  });

  ngOnInit(): void {
    const el = this.scrollContainerRef.nativeElement;
    this.scrollHandler = () => {
      if (this.rafId !== null) return;
      this.rafId = requestAnimationFrame(() => {
        this.rafId = null;
        this.scrollTop.set(el.scrollTop);
        this.detectVisibleCategory();
      });
    };
    el.addEventListener('scroll', this.scrollHandler, { passive: true });
  }

  ngOnDestroy(): void {
    this.scrollContainerRef?.nativeElement.removeEventListener('scroll', this.scrollHandler);
    if (this.rafId !== null) cancelAnimationFrame(this.rafId);
  }

  scrollToCategory(categoryId: EmojiCategory): void {
    const rows = this.allRows();
    let y = 0;
    for (const row of rows) {
      if (row.type === 'header' && row.category?.id === categoryId) {
        this.scrollContainerRef.nativeElement.scrollTo({ top: y, behavior: 'smooth' });
        return;
      }
      y += row.type === 'header' ? this.headerHeight : this.cellSize();
    }
  }

  onLongPress(emoji: Emoji, rect: DOMRect): void {
    this.skinToneEmoji.set(emoji);
    const container = this.scrollContainerRef.nativeElement;
    const containerRect = container.getBoundingClientRect();
    const popoverWidth = 276; // 6 buttons * 40px + gaps + padding
    const cellCenterX = rect.left - containerRect.left + rect.width / 2;
    const x = Math.max(8, Math.min(cellCenterX - popoverWidth / 2, container.clientWidth - popoverWidth - 8));
    const y = rect.top - containerRect.top + this.scrollTop() - 52;
    this.popoverX.set(x);
    this.popoverY.set(Math.max(0, y));
  }

  onToneSelected(tone: SkinTone): void {
    const emoji = this.skinToneEmoji();
    this.skinToneEmoji.set(null);
    if (emoji) {
      const charWithTone = this.dataService.getEmojiWithSkinTone(emoji, tone);
      this.emojiSelect.emit({ ...emoji, char: charWithTone });
    }
  }

  private detectVisibleCategory(): void {
    const rows = this.allRows();
    const st = this.scrollTop();
    let acc = 0;
    for (const row of rows) {
      const rh = row.type === 'header' ? this.headerHeight : this.cellSize();
      if (acc + rh > st && row.type === 'header' && row.category) {
        this.categoryVisible.emit(row.category.id);
        return;
      }
      acc += rh;
    }
  }
}
