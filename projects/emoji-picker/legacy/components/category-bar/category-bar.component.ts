import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryMeta, EmojiCategory } from '@nicematic/emoji-picker';

@Component({
  standalone: false,
  selector: 'nicematic-category-bar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nav class="flex items-center h-[46px]" style="flex-shrink:0;background:var(--nicematic-picker-nav-bg);border-bottom:1px solid var(--nicematic-picker-border);">
      <button *ngFor="let cat of categories" type="button"
        class="relative flex-1 flex items-center justify-center h-10 min-w-0 rounded-xl text-[20px] cursor-pointer transition-all duration-200 grayscale"
        [class.active-cat]="activeCategory === cat.id"
        [attr.aria-label]="cat.label" [title]="cat.label"
        (click)="categorySelect.emit(cat.id)">
        {{ cat.icon }}
        <span *ngIf="activeCategory === cat.id" class="absolute -bottom-[3px] left-1/2 -translate-x-1/2 w-5 h-[3px] rounded-full" style="background:var(--nicematic-picker-accent);"></span>
      </button>
    </nav>
  `,
  styles: [`
    .active-cat { filter: grayscale(0) !important; opacity: 1 !important; }
    button:not(.active-cat) { opacity: 0.4; }
    button:not(.active-cat):hover { opacity: 0.7; filter: grayscale(0); }
  `],
})
export class CategoryBarComponent {
  @Input() categories: CategoryMeta[] = [];
  @Input() activeCategory: EmojiCategory = 'smileys';
  @Output() categorySelect = new EventEmitter<EmojiCategory>();
}
