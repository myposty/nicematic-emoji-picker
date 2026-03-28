import { Component, ChangeDetectionStrategy, ViewEncapsulation, Input, Output, EventEmitter, ViewChild, ElementRef, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Emoji, EmojiCategory, EmojiLocale, CategoryMeta, getCategories, getLocaleStrings, EmojiPickerConfig, DEFAULT_CONFIG, LocaleStrings } from '@nicematic/emoji-picker';
import { EmojiDataService } from '../../services/emoji-data.service';
import { EmojiSearchService } from '../../services/emoji-search.service';
import { EmojiRecentsService } from '../../services/emoji-recents.service';
import { EmojiSkinToneService } from '../../services/emoji-skintone.service';
import { EmojiGridComponent } from '../emoji-grid/emoji-grid.component';

@Component({
  standalone: false,
  selector: 'nicematic-picker',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['../../../src/styles/nicematic-picker.css'],
  host: {
    'style': 'display:block;width:100%;box-sizing:border-box;',
    '(keydown.escape)': 'pickerClose.emit()',
  },
  template: `
    <div #pickerContainer
      class="flex flex-col rounded-2xl shadow-2xl overflow-hidden select-none animate-[nicematic-fade-in_0.15s_ease-out]"
      style="user-select:none;-webkit-user-select:none;box-sizing:border-box;width:100%;background:var(--nicematic-picker-bg,#222230);color:var(--nicematic-picker-text,#e5e7eb);border-radius:var(--nicematic-picker-radius,16px);"
      [style.max-width.px]="cfg.pickerWidth" [style.height.px]="cfg.pickerHeight"
      (dragstart)="$event.preventDefault()">

      <nicematic-category-bar *ngIf="cfg.showCategories && !isSearching"
        [categories]="visibleCategories" [activeCategory]="activeCategory"
        (categorySelect)="onCategorySelect($event)">
      </nicematic-category-bar>

      <nicematic-search-bar *ngIf="cfg.showSearch"
        [placeholder]="strings.search"
        (searchChange)="onSearch($event)">
      </nicematic-search-bar>

      <div class="flex-1 min-h-0 overflow-hidden">
        <nicematic-grid
          [emojis]="displayedEmojis" [categories]="visibleCategories"
          [skinTone]="skinToneService.currentSkinTone" [columns]="cfg.columns"
          [cellSize]="cfg.cellSize" [height]="gridHeight"
          [noResultsText]="strings.noResults" [isSearchMode]="isSearching"
          (emojiSelect)="onEmojiSelect($event)"
          (categoryVisible)="activeCategory = $event">
        </nicematic-grid>
      </div>
    </div>
  `,
})
export class EmojiPickerComponent implements OnInit, OnDestroy {
  @Input() columns?: number;
  @Input() cellSize?: number;
  @Input() maxRecents?: number;
  @Input() locale?: string;
  @Input() showSearch?: boolean;
  @Input() showCategories?: boolean;
  @Input() pickerHeight?: number;
  @Input() pickerWidth?: number;
  @Output() emojiSelect = new EventEmitter<Emoji>();
  @Output() pickerClose = new EventEmitter<void>();

  @ViewChild('pickerContainer', { static: true }) containerRef!: ElementRef<HTMLElement>;
  @ViewChild(EmojiGridComponent) grid!: EmojiGridComponent;

  activeCategory: EmojiCategory = 'smileys';
  searchQuery = '';
  cfg: EmojiPickerConfig = { ...DEFAULT_CONFIG };
  strings!: LocaleStrings;
  isSearching = false;
  visibleCategories: CategoryMeta[] = [];
  displayedEmojis: Emoji[] = [];
  gridHeight = 300;

  private resizeObserver: ResizeObserver | null = null;
  private clickOutsideHandler!: (e: Event) => void;
  private sub: any;

  constructor(
    private elRef: ElementRef,
    private dataService: EmojiDataService,
    private searchService: EmojiSearchService,
    private recentsService: EmojiRecentsService,
    public skinToneService: EmojiSkinToneService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.buildConfig();
    this.strings = getLocaleStrings((this.cfg.locale || 'es') as EmojiLocale);
    this.updateEmojis();

    if (this.recentsService.recents.length > 0) this.activeCategory = 'recent';

    this.sub = this.recentsService.recents$.subscribe(() => {
      this.updateEmojis();
      this.cdr.markForCheck();
    });

    this.resizeObserver = new ResizeObserver(() => this.cdr.markForCheck());
    this.resizeObserver.observe(this.containerRef.nativeElement);

    this.clickOutsideHandler = (e: Event) => {
      if (!this.elRef.nativeElement.contains(e.target)) this.pickerClose.emit();
    };
    setTimeout(() => document.addEventListener('pointerdown', this.clickOutsideHandler), 100);
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
    document.removeEventListener('pointerdown', this.clickOutsideHandler);
    this.sub?.unsubscribe();
  }

  ngOnChanges(): void {
    this.buildConfig();
    this.strings = getLocaleStrings((this.cfg.locale || 'es') as EmojiLocale);
    this.updateEmojis();
  }

  onSearch(query: string): void {
    this.searchQuery = query;
    this.isSearching = query.length > 0;
    this.displayedEmojis = this.isSearching ? this.searchService.search(query) : this.buildEmojiList();
    this.cdr.markForCheck();
  }

  onCategorySelect(category: EmojiCategory): void {
    this.activeCategory = category;
    this.grid?.scrollToCategory(category);
  }

  onEmojiSelect(emoji: Emoji): void {
    this.recentsService.addRecent(emoji);
    this.emojiSelect.emit(emoji);
  }

  private buildConfig(): void {
    const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));
    this.cfg = {
      ...DEFAULT_CONFIG,
      ...(this.columns != null && { columns: clamp(this.columns, 3, 15) }),
      ...(this.cellSize != null && { cellSize: clamp(this.cellSize, 24, 64) }),
      ...(this.maxRecents != null && { maxRecents: clamp(this.maxRecents, 0, 36) }),
      ...(this.locale != null && { locale: this.locale }),
      ...(this.showSearch != null && { showSearch: this.showSearch }),
      ...(this.showCategories != null && { showCategories: this.showCategories }),
      ...(this.pickerHeight != null && { pickerHeight: clamp(this.pickerHeight, 200, 800) }),
      ...(this.pickerWidth != null && { pickerWidth: clamp(this.pickerWidth, 200, 800) }),
    };
    this.gridHeight = this.cfg.pickerHeight - (this.cfg.showCategories ? 48 : 0) - (this.cfg.showSearch ? 46 : 0);
    if (this.gridHeight < 100) this.gridHeight = 100;
  }

  private updateEmojis(): void {
    this.visibleCategories = getCategories((this.cfg.locale || 'es') as EmojiLocale)
      .filter(c => {
        if (c.id === 'recent' && this.recentsService.recents.length === 0) return false;
        return true;
      });
    this.displayedEmojis = this.isSearching ? this.searchService.search(this.searchQuery) : this.buildEmojiList();
  }

  private buildEmojiList(): Emoji[] {
    const recents = this.recentsService.recents;
    const all = this.dataService.allEmojis;
    if (recents.length > 0) {
      return [...recents.map(e => ({ ...e, category: 'recent' as const })), ...all];
    }
    return all;
  }
}
