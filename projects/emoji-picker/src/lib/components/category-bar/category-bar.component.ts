import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
} from '@angular/core';
import { CategoryMeta, EmojiCategory } from '../../models/emoji.model';

@Component({
  selector: 'nme-category-bar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nav class="flex items-center justify-around px-1 h-[46px] border-b border-white/5 bg-[#1a1a28]">
      @for (cat of categories(); track cat.id) {
        <button
          type="button"
          class="relative flex items-center justify-center w-10 h-10 rounded-xl text-[20px] cursor-pointer transition-all duration-200 grayscale"
          [class]="activeCategory() === cat.id
            ? '!grayscale-0 opacity-100'
            : 'opacity-40 hover:opacity-70 hover:grayscale-0'"
          [attr.aria-label]="cat.label"
          [title]="cat.label"
          (click)="categorySelect.emit(cat.id)"
        >
          {{ cat.icon }}
          @if (activeCategory() === cat.id) {
            <span class="absolute -bottom-[3px] left-1/2 -translate-x-1/2 w-5 h-[3px] rounded-full bg-blue-500"></span>
          }
        </button>
      }
    </nav>
  `,
})
export class CategoryBarComponent {
  readonly categories = input.required<CategoryMeta[]>();
  readonly activeCategory = input<EmojiCategory>('smileys');
  readonly categorySelect = output<EmojiCategory>();
}
