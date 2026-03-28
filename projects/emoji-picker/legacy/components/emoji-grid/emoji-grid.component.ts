import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, ElementRef, ViewChild, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Emoji, EmojiCategory, CategoryMeta, SkinTone } from '@nicematic/emoji-picker';
import { EmojiDataService } from '../../services/emoji-data.service';

interface CategoryGroup { category: CategoryMeta; emojis: Emoji[]; displayChars: string[]; }

@Component({
  standalone: false,
  selector: 'nicematic-grid',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div #scrollContainer class="overflow-y-auto overflow-x-hidden"
         style="scrollbar-width:none;-webkit-overflow-scrolling:touch;" [style.height.px]="height">

      <div *ngIf="isSearchMode && emojis.length === 0" class="flex flex-col items-center justify-center gap-2"
           style="color:var(--nicematic-picker-text-muted);" [style.height.px]="height">
        <span class="text-4xl">😕</span>
        <span class="text-sm">{{ noResultsText }}</span>
      </div>

      <div *ngIf="isSearchMode && emojis.length > 0" class="grid px-1 py-1"
           [style.grid-template-columns]="'repeat(auto-fill, minmax(' + cellSize + 'px, 1fr))'">
        <nicematic-cell *ngFor="let emoji of emojis; trackBy: trackByChar"
          [emoji]="emoji" [displayChar]="getDisplay(emoji)" [size]="cellSize"
          (emojiClick)="emojiSelect.emit($event)"
          (emojiLongPress)="onLongPress($event.emoji, $event.rect)">
        </nicematic-cell>
      </div>

      <ng-container *ngIf="!isSearchMode">
        <div *ngFor="let group of groups; trackBy: trackByCategory" [attr.data-cat-id]="group.category.id">
          <div class="flex items-center px-4 text-[13px] font-bold tracking-wide h-7"
               style="color:var(--nicematic-picker-text-muted);">{{ group.category.label }}</div>
          <div class="grid px-1" [style.grid-template-columns]="'repeat(auto-fill, minmax(' + cellSize + 'px, 1fr))'">
            <nicematic-cell *ngFor="let emoji of group.emojis; let i = index; trackBy: trackByChar"
              [emoji]="emoji" [displayChar]="group.displayChars[i]" [size]="cellSize"
              (emojiClick)="emojiSelect.emit($event)"
              (emojiLongPress)="onLongPress($event.emoji, $event.rect)">
            </nicematic-cell>
          </div>
        </div>
        <div class="h-3"></div>
      </ng-container>

      <nicematic-skin-tone-popover *ngIf="skinToneEmoji"
        [emoji]="skinToneEmoji" [x]="popoverX" [y]="popoverY"
        (toneSelect)="onToneSelected($event)" (close)="skinToneEmoji = null">
      </nicematic-skin-tone-popover>
    </div>
  `,
})
export class EmojiGridComponent implements OnInit, OnDestroy {
  @Input() emojis: Emoji[] = [];
  @Input() categories: CategoryMeta[] = [];
  @Input() skinTone: SkinTone = '';
  @Input() columns = 9;
  @Input() cellSize = 44;
  @Input() height = 300;
  @Input() noResultsText = 'No se encontraron emojis';
  @Input() isSearchMode = false;
  @Output() emojiSelect = new EventEmitter<Emoji>();
  @Output() categoryVisible = new EventEmitter<EmojiCategory>();

  @ViewChild('scrollContainer', { static: true }) scrollContainerRef!: ElementRef<HTMLElement>;

  skinToneEmoji: Emoji | null = null;
  popoverX = 0; popoverY = 0;
  groups: CategoryGroup[] = [];

  private scrollHandler!: () => void;
  private ticking = false;
  private lastVisibleCategory: EmojiCategory | null = null;

  constructor(public dataService: EmojiDataService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    const el = this.scrollContainerRef.nativeElement;
    this.scrollHandler = () => {
      if (this.ticking) return;
      this.ticking = true;
      requestAnimationFrame(() => { this.ticking = false; this.detectVisibleCategory(el); });
    };
    el.addEventListener('scroll', this.scrollHandler, { passive: true });
  }

  ngOnDestroy(): void {
    this.scrollContainerRef?.nativeElement.removeEventListener('scroll', this.scrollHandler);
  }

  ngOnChanges(): void { this.buildGroups(); }

  getDisplay(emoji: Emoji): string { return this.dataService.getEmojiWithSkinTone(emoji, this.skinTone); }

  trackByChar(_: number, emoji: Emoji): string { return emoji.char; }
  trackByCategory(_: number, group: CategoryGroup): string { return group.category.id; }

  scrollToCategory(categoryId: EmojiCategory): void {
    const el = this.scrollContainerRef.nativeElement;
    const target = el.querySelector(`[data-cat-id="${categoryId}"]`);
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  onLongPress(emoji: Emoji, rect: DOMRect): void {
    this.skinToneEmoji = emoji;
    const pw = 276;
    const cx = rect.left + rect.width / 2;
    this.popoverX = Math.max(4, Math.min(cx - pw / 2, window.innerWidth - pw - 4));
    this.popoverY = Math.max(4, rect.top - 60);
    this.cdr.markForCheck();
  }

  onToneSelected(tone: SkinTone): void {
    const emoji = this.skinToneEmoji;
    this.skinToneEmoji = null;
    if (emoji) this.emojiSelect.emit({ ...emoji, char: this.dataService.getEmojiWithSkinTone(emoji, tone) });
    this.cdr.markForCheck();
  }

  private buildGroups(): void {
    if (this.isSearchMode) { this.groups = []; return; }
    const grouped = new Map<EmojiCategory, Emoji[]>();
    for (const emoji of this.emojis) {
      const list = grouped.get(emoji.category);
      if (list) list.push(emoji); else grouped.set(emoji.category, [emoji]);
    }
    this.groups = this.categories.filter(c => grouped.has(c.id)).map(cat => ({
      category: cat,
      emojis: grouped.get(cat.id)!,
      displayChars: grouped.get(cat.id)!.map(e => this.dataService.getEmojiWithSkinTone(e, this.skinTone)),
    }));
  }

  private detectVisibleCategory(el: HTMLElement): void {
    const headers = el.querySelectorAll('[data-cat-id]');
    let found: EmojiCategory | null = null;
    const containerTop = el.getBoundingClientRect().top;
    for (const h of Array.from(headers)) {
      if ((h as HTMLElement).getBoundingClientRect().top - containerTop <= 60)
        found = (h as HTMLElement).dataset['catId'] as EmojiCategory;
    }
    if (found && found !== this.lastVisibleCategory) {
      this.lastVisibleCategory = found;
      this.categoryVisible.emit(found);
    }
  }
}
