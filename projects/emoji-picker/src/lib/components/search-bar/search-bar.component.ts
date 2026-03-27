import {
  Component,
  ChangeDetectionStrategy,
  output,
  signal,
  OnDestroy,
  ViewChild,
  ElementRef,
} from '@angular/core';

@Component({
  selector: 'nicematic-search-bar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="px-3 pt-2.5 pb-1.5">
      <div class="relative flex items-center">
        <svg class="absolute left-3 w-4 h-4 pointer-events-none" style="color:var(--nme-text-muted);" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
        </svg>
        <input
          #searchInput
          type="text"
          placeholder="Buscar emoji"
          class="w-full pl-10 pr-9 py-2 text-[13px] rounded-full outline-none transition-all duration-200"
          style="background:var(--nme-input-bg);color:var(--nme-text);border:1px solid var(--nme-input-border);"
          [value]="query()"
          (input)="onInput($event)"
          (keydown.escape)="clear()"
          aria-label="Buscar emoji"
        />
        @if (query()) {
          <button
            type="button"
            class="absolute right-3 w-4 h-4 flex items-center justify-center text-gray-500 hover:text-gray-300 cursor-pointer transition-colors"
            (click)="clear()"
            aria-label="Limpiar búsqueda"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" class="w-3.5 h-3.5">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        }
      </div>
    </div>
  `,
})
export class SearchBarComponent implements OnDestroy {
  readonly query = signal('');
  readonly searchChange = output<string>();

  @ViewChild('searchInput') inputRef!: ElementRef<HTMLInputElement>;

  private debounceTimer: ReturnType<typeof setTimeout> | null = null;

  onInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.query.set(value);

    if (this.debounceTimer) clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => {
      this.searchChange.emit(value);
    }, 150);
  }

  clear(): void {
    this.query.set('');
    this.searchChange.emit('');
    if (this.inputRef) {
      this.inputRef.nativeElement.value = '';
      this.inputRef.nativeElement.focus();
    }
  }

  ngOnDestroy(): void {
    if (this.debounceTimer) clearTimeout(this.debounceTimer);
  }
}
