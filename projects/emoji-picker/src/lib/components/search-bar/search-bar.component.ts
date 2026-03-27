import {
  Component,
  ChangeDetectionStrategy,
  output,
  signal,
  OnDestroy,
} from '@angular/core';

@Component({
  selector: 'nme-search-bar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="px-3 pt-2.5 pb-1.5">
      <div class="relative flex items-center">
        <svg class="absolute left-3 w-4 h-4 text-gray-500 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
        </svg>
        <input
          type="text"
          placeholder="Buscar emoji"
          class="w-full pl-10 pr-4 py-2 text-[13px] rounded-full bg-white/5 text-gray-200 border border-white/10 outline-none focus:border-blue-500/50 focus:bg-white/8 placeholder-gray-500 transition-all duration-200"
          [value]="query()"
          (input)="onInput($event)"
          aria-label="Buscar emoji"
        />
      </div>
    </div>
  `,
})
export class SearchBarComponent implements OnDestroy {
  readonly query = signal('');
  readonly searchChange = output<string>();

  private debounceTimer: ReturnType<typeof setTimeout> | null = null;

  onInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.query.set(value);

    if (this.debounceTimer) clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => {
      this.searchChange.emit(value);
    }, 150);
  }

  ngOnDestroy(): void {
    if (this.debounceTimer) clearTimeout(this.debounceTimer);
  }
}
