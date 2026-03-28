import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: false,
  selector: 'nicematic-search-bar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="px-3 pt-2.5 pb-1.5">
      <div class="relative flex items-center">
        <svg class="absolute left-3 w-4 h-4 pointer-events-none" style="color:var(--nicematic-picker-text-muted);" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
        </svg>
        <input #searchInput type="text" [placeholder]="placeholder"
          class="w-full pl-10 pr-9 py-2 text-[13px] rounded-full outline-none transition-all duration-200"
          style="background:var(--nicematic-picker-input-bg);color:var(--nicematic-picker-text);border:1px solid var(--nicematic-picker-input-border);"
          [value]="query" (input)="onInput($event)" (keydown.escape)="clear()" aria-label="Search emoji" />
        <button *ngIf="query" type="button"
          class="absolute right-3 w-4 h-4 flex items-center justify-center cursor-pointer transition-colors"
          style="color:var(--nicematic-picker-text-muted);" (click)="clear()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" class="w-3.5 h-3.5">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>
      </div>
    </div>
  `,
})
export class SearchBarComponent implements OnDestroy {
  @Input() placeholder = 'Buscar emoji';
  @Output() searchChange = new EventEmitter<string>();

  query = '';
  private debounceTimer: any = null;

  onInput(event: Event): void {
    this.query = (event.target as HTMLInputElement).value;
    if (this.debounceTimer) clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => this.searchChange.emit(this.query), 150);
  }

  clear(): void {
    this.query = '';
    this.searchChange.emit('');
  }

  ngOnDestroy(): void { if (this.debounceTimer) clearTimeout(this.debounceTimer); }
}
