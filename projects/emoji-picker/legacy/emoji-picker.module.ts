import { NgModule, VERSION } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmojiPickerComponent } from './components/picker/picker.component';
import { EmojiGridComponent } from './components/emoji-grid/emoji-grid.component';
import { EmojiCellComponent } from './components/emoji-cell/emoji-cell.component';
import { CategoryBarComponent } from './components/category-bar/category-bar.component';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { SkinTonePopoverComponent } from './components/skin-tone-popover/skin-tone-popover.component';

const COMPONENTS = [
  EmojiPickerComponent,
  EmojiGridComponent,
  EmojiCellComponent,
  CategoryBarComponent,
  SearchBarComponent,
  SkinTonePopoverComponent,
];

@NgModule({
  declarations: COMPONENTS,
  imports: [CommonModule],
  exports: [EmojiPickerComponent],
})
export class EmojiPickerModule {
  constructor() {
    const major = parseInt(VERSION.major, 10);
    if (major < 14) {
      console.error(
        `[@nicematic/emoji-picker/legacy] Angular ${VERSION.full} is not supported. ` +
        `This module is compatible with Angular 14.x to 16.x.`
      );
    }
    if (major >= 17) {
      console.warn(
        `[@nicematic/emoji-picker/legacy] You are using Angular ${VERSION.full}. ` +
        `This legacy module is for Angular 14-16. ` +
        `Use the standalone version instead: import { EmojiPickerComponent } from "@nicematic/emoji-picker"`
      );
    }
  }
}
