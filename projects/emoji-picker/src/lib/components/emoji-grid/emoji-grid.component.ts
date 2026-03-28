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

interface CategoryGroup {
  category: CategoryMeta;
  emojis: Emoji[];
  displayChars: string[];
}

@Component({
  selector: 'nicematic-grid',
  standalone: true,
  imports: [EmojiCellComponent, SkinTonePopoverComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      #scrollContainer
      class="overflow-y-auto overflow-x-hidden"
      style="scrollbar-width:none;-webkit-overflow-scrolling:touch;"
      [style.height.px]="height()"
    >
      @if (isSearchMode() && emojis().length === 0) {
        <div class="flex flex-col items-center justify-center gap-2" style="color:var(--nme-text-muted);" [style.height.px]="height()">
          <span class="text-4xl">😕</span>
          <span class="text-sm">{{ noResultsText() }}</span>
        </div>
      } @else if (isSearchMode()) {
        <div class="flex flex-wrap px-2 py-1">
          @for (emoji of emojis(); track emoji.char) {
            <nicematic-cell
              [emoji]="emoji"
              [displayChar]="dataService.getEmojiWithSkinTone(emoji, skinTone())"
              [size]="cellSize()"
              (emojiClick)="emojiSelect.emit($event)"
              (emojiLongPress)="onLongPress($event.emoji, $event.rect)"
            />
          }
        </div>
      } @else {
        @for (group of groups(); track group.category.id) {
          <div [attr.data-cat-id]="group.category.id">
            <div class="flex items-center px-4 text-[13px] font-bold tracking-wide h-7" style="color:var(--nme-text-muted);">
              {{ group.category.label }}
            </div>
            <div class="flex flex-wrap px-2">
              @for (emoji of group.emojis; track emoji.char; let i = $index) {
                <nicematic-cell
                  [emoji]="emoji"
                  [displayChar]="group.displayChars[i]"
                  [size]="cellSize()"
                  (emojiClick)="emojiSelect.emit($event)"
                  (emojiLongPress)="onLongPress($event.emoji, $event.rect)"
                />
              }
            </div>
          </div>
        }
        <div class="h-3"></div>
      }

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
  readonly cellSize = input<number>(44);
  readonly noResultsText = input<string>('No se encontraron emojis');
  readonly height = input<number>(300);
  readonly contentHeight = input<number>(0);
  readonly isSearchMode = input<boolean>(false);

  readonly emojiSelect = output<Emoji>();
  readonly categoryVisible = output<EmojiCategory>();

  @ViewChild('scrollContainer', { static: true })
  scrollContainerRef!: ElementRef<HTMLElement>;

  readonly skinToneEmoji = signal<Emoji | null>(null);
  readonly popoverX = signal(0);
  readonly popoverY = signal(0);

  private scrollHandler!: () => void;
  private ticking = false;
  private lastVisibleCategory: EmojiCategory | null = null;

  constructor(public dataService: EmojiDataService) {}

  readonly groups = computed<CategoryGroup[]>(() => {
    const emojis = this.emojis();
    const tone = this.skinTone();
    const cats = this.categories();
    const grouped = new Map<EmojiCategory, Emoji[]>();
    for (const emoji of emojis) {
      const list = grouped.get(emoji.category);
      if (list) list.push(emoji);
      else grouped.set(emoji.category, [emoji]);
    }
    const result: CategoryGroup[] = [];
    for (const cat of cats) {
      const catEmojis = grouped.get(cat.id);
      if (!catEmojis?.length) continue;
      result.push({
        category: cat,
        emojis: catEmojis,
        displayChars: catEmojis.map(e => this.dataService.getEmojiWithSkinTone(e, tone)),
      });
    }
    return result;
  });

  ngOnInit(): void {
    const el = this.scrollContainerRef.nativeElement;
    this.scrollHandler = () => {
      if (this.ticking) return;
      this.ticking = true;
      requestAnimationFrame(() => {
        this.ticking = false;
        this.detectVisibleCategory(el);
      });
    };
    el.addEventListener('scroll', this.scrollHandler, { passive: true });
  }

  ngOnDestroy(): void {
    this.scrollContainerRef?.nativeElement.removeEventListener('scroll', this.scrollHandler);
  }

  scrollToCategory(categoryId: EmojiCategory): void {
    const el = this.scrollContainerRef.nativeElement;
    const target = el.querySelector(`[data-cat-id="${categoryId}"]`);
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  onLongPress(emoji: Emoji, rect: DOMRect): void {
    this.skinToneEmoji.set(emoji);
    const popoverWidth = 276;
    const popoverHeight = 52;
    const cx = rect.left + rect.width / 2;
    const x = Math.max(4, Math.min(cx - popoverWidth / 2, window.innerWidth - popoverWidth - 4));
    const y = rect.top - popoverHeight - 8;
    this.popoverX.set(x);
    this.popoverY.set(Math.max(4, y));
  }

  onToneSelected(tone: SkinTone): void {
    const emoji = this.skinToneEmoji();
    this.skinToneEmoji.set(null);
    if (emoji) {
      this.emojiSelect.emit({ ...emoji, char: this.dataService.getEmojiWithSkinTone(emoji, tone) });
    }
  }

  private detectVisibleCategory(el: HTMLElement): void {
    const headers = el.querySelectorAll('[data-cat-id]');
    let found: EmojiCategory | null = null;
    const containerTop = el.getBoundingClientRect().top;
    for (const h of Array.from(headers)) {
      const headerTop = (h as HTMLElement).getBoundingClientRect().top - containerTop;
      if (headerTop <= 60) {
        found = (h as HTMLElement).dataset['catId'] as EmojiCategory;
      }
    }
    if (found && found !== this.lastVisibleCategory) {
      this.lastVisibleCategory = found;
      this.categoryVisible.emit(found);
    }
  }
}
