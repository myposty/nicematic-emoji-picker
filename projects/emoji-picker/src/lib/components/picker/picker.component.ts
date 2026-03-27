import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  input,
  output,
  computed,
  signal,
  ViewChild,
  ElementRef,
  OnInit,
  OnDestroy,
} from '@angular/core';
import {
  Emoji,
  EmojiCategory,
  CategoryMeta,
  CATEGORIES,
  EmojiPickerConfig,
  DEFAULT_CONFIG,
} from '../../models/emoji.model';
import { EmojiDataService } from '../../services/emoji-data.service';
import { EmojiSearchService } from '../../services/emoji-search.service';
import { EmojiRecentsService } from '../../services/emoji-recents.service';
import { EmojiSkinToneService } from '../../services/emoji-skintone.service';
import { CategoryBarComponent } from '../category-bar/category-bar.component';
import { SearchBarComponent } from '../search-bar/search-bar.component';
import { EmojiGridComponent } from '../emoji-grid/emoji-grid.component';

@Component({
  selector: 'nicematic-picker',
  standalone: true,
  imports: [CategoryBarComponent, SearchBarComponent, EmojiGridComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['../../../styles/nicematic-picker.css'],
  host: {
    'style': 'display:block;width:100%;box-sizing:border-box;',
  },
  template: `
    <div
      #pickerContainer
      class="flex flex-col rounded-2xl shadow-2xl bg-[#222230] overflow-hidden select-none"
      style="user-select:none;-webkit-user-select:none;-webkit-user-drag:none;box-sizing:border-box;width:100%;"
      [style.max-width.px]="config().pickerWidth"
      [style.height.px]="config().pickerHeight"
      (dragstart)="$event.preventDefault()"
    >
      <!-- Category tabs TOP (like WhatsApp) -->
      @if (config().showCategories && !isSearching()) {
        <nicematic-category-bar
          [categories]="visibleCategories()"
          [activeCategory]="activeCategory()"
          (categorySelect)="onCategorySelect($event)"
        />
      }

      <!-- Search -->
      @if (config().showSearch) {
        <nicematic-search-bar (searchChange)="onSearch($event)" />
      }

      <!-- Grid -->
      <div class="flex-1 min-h-0 overflow-hidden">
        <nicematic-grid
          [emojis]="displayedEmojis()"
          [categories]="visibleCategories()"
          [skinTone]="skinToneService.currentSkinTone()"
          [columns]="effectiveColumns()"
          [cellSize]="effectiveCellSize()"
          [height]="gridHeight()"
          [contentHeight]="contentHeight()"
          [isSearchMode]="isSearching()"
          (emojiSelect)="onEmojiSelect($event)"
          (categoryVisible)="activeCategory.set($event)"
        />
      </div>
    </div>
  `,
})
export class EmojiPickerComponent implements OnInit, OnDestroy {
  readonly emojiSelect = output<Emoji>();

  readonly columns = input<number | undefined>(undefined);
  readonly cellSize = input<number | undefined>(undefined);
  readonly maxRecents = input<number | undefined>(undefined);
  readonly locale = input<string | undefined>(undefined);
  readonly showSearch = input<boolean | undefined>(undefined);
  readonly showCategories = input<boolean | undefined>(undefined);
  readonly showSkinTones = input<boolean | undefined>(undefined);
  readonly includeCategories = input<EmojiCategory[] | undefined>(undefined);
  readonly pickerHeight = input<number | undefined>(undefined);
  readonly pickerWidth = input<number | undefined>(undefined);

  @ViewChild('pickerContainer', { static: true }) containerRef!: ElementRef<HTMLElement>;
  @ViewChild(EmojiGridComponent) grid!: EmojiGridComponent;

  readonly activeCategory = signal<EmojiCategory>('smileys');
  readonly searchQuery = signal('');
  readonly containerWidth = signal(420);

  readonly skinTones = ['', '🏻', '🏼', '🏽', '🏾', '🏿'] as const;

  private resizeObserver: ResizeObserver | null = null;

  constructor(
    private dataService: EmojiDataService,
    private searchService: EmojiSearchService,
    private recentsService: EmojiRecentsService,
    public skinToneService: EmojiSkinToneService,
  ) {}

  ngOnInit(): void {
    this.resizeObserver = new ResizeObserver(entries => {
      const w = entries[0]?.contentRect.width;
      if (w && w > 0) this.containerWidth.set(w);
    });
    this.resizeObserver.observe(this.containerRef.nativeElement);
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
  }

  readonly effectiveCellSize = computed(() => {
    return this.config().cellSize;
  });

  readonly effectiveColumns = computed(() => {
    if (this.columns() !== undefined) return this.columns()!;
    const w = this.containerWidth();
    const cell = this.effectiveCellSize();
    const padding = 16;
    return Math.max(5, Math.floor((w - padding) / cell));
  });

  readonly config = computed<EmojiPickerConfig>(() => ({
    ...DEFAULT_CONFIG,
    ...(this.columns() !== undefined && { columns: this.columns()! }),
    ...(this.cellSize() !== undefined && { cellSize: this.cellSize()! }),
    ...(this.maxRecents() !== undefined && { maxRecents: this.maxRecents()! }),
    ...(this.locale() !== undefined && { locale: this.locale()! }),
    ...(this.showSearch() !== undefined && { showSearch: this.showSearch()! }),
    ...(this.showCategories() !== undefined && { showCategories: this.showCategories()! }),
    ...(this.showSkinTones() !== undefined && { showSkinTones: this.showSkinTones()! }),
    ...(this.includeCategories() !== undefined && { includeCategories: this.includeCategories()! }),
    ...(this.pickerHeight() !== undefined && { pickerHeight: this.pickerHeight()! }),
    ...(this.pickerWidth() !== undefined && { pickerWidth: this.pickerWidth()! }),
  }));

  readonly isSearching = computed(() => this.searchQuery().length > 0);

  readonly visibleCategories = computed<CategoryMeta[]>(() => {
    const include = this.config().includeCategories;
    const hasRecents = this.recentsService.recents().length > 0;
    return CATEGORIES.filter(c => {
      if (c.id === 'recent' && !hasRecents) return false;
      if (include.length > 0 && !include.includes(c.id)) return false;
      return true;
    });
  });

  readonly displayedEmojis = computed<Emoji[]>(() => {
    if (this.isSearching()) {
      return this.searchService.results();
    }

    const recents = this.recentsService.recents();
    const all = this.dataService.allEmojis();
    const include = this.config().includeCategories;

    const filtered = include.length > 0
      ? all.filter(e => include.includes(e.category))
      : all;

    if (recents.length > 0) {
      const recentEmojis: Emoji[] = recents.map(e => ({ ...e, category: 'recent' as const }));
      return [...recentEmojis, ...filtered];
    }

    return filtered;
  });

  readonly gridHeight = computed(() => {
    let h = this.config().pickerHeight;
    if (this.config().showCategories && !this.isSearching()) h -= 48;
    if (this.config().showSearch) h -= 46;
    return Math.max(h, 100);
  });

  readonly contentHeight = computed(() => {
    const emojis = this.displayedEmojis();
    const cols = this.effectiveColumns();
    const cellSize = this.effectiveCellSize();
    const headerHeight = 32;

    if (this.isSearching()) {
      return Math.ceil(emojis.length / cols) * cellSize;
    }

    const cats = this.visibleCategories();
    const grouped = new Map<string, number>();
    for (const e of emojis) {
      grouped.set(e.category, (grouped.get(e.category) || 0) + 1);
    }

    let total = 0;
    for (const cat of cats) {
      const count = grouped.get(cat.id) || 0;
      if (count === 0) continue;
      total += headerHeight;
      total += Math.ceil(count / cols) * cellSize;
    }
    return total + 12;
  });

  onSearch(query: string): void {
    this.searchQuery.set(query);
    this.searchService.query.set(query);
  }

  onCategorySelect(category: EmojiCategory): void {
    this.activeCategory.set(category);
    this.grid?.scrollToCategory(category);
  }

  onEmojiSelect(emoji: Emoji): void {
    this.recentsService.addRecent(emoji);
    this.emojiSelect.emit(emoji);
  }
}
