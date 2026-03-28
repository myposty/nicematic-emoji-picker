/*
 * Public API Surface of @nicematic/emoji-picker/legacy
 * For Angular 14-16. Angular 17+ should use '@nicematic/emoji-picker'.
 */

// Module
export { EmojiPickerModule } from './emoji-picker.module';

// Types (shared from primary entry point)
export type { Emoji, EmojiCategory, EmojiLocale, CategoryMeta, SkinTone, EmojiPickerConfig, LocaleStrings } from '@nicematic/emoji-picker';

// Values (shared from primary entry point)
export { SKIN_TONES, SKIN_TONE_LABELS, CATEGORIES, EMOJI_DATA, DEFAULT_CONFIG, getCategories, getLocaleStrings, CATEGORY_ICONS } from '@nicematic/emoji-picker';

// Legacy Components
export { EmojiPickerComponent } from './components/picker/picker.component';
export { EmojiGridComponent } from './components/emoji-grid/emoji-grid.component';
export { EmojiCellComponent } from './components/emoji-cell/emoji-cell.component';
export { CategoryBarComponent } from './components/category-bar/category-bar.component';
export { SearchBarComponent } from './components/search-bar/search-bar.component';
export { SkinTonePopoverComponent } from './components/skin-tone-popover/skin-tone-popover.component';

// Legacy Services
export { EmojiDataService } from './services/emoji-data.service';
export { EmojiSearchService } from './services/emoji-search.service';
export { EmojiRecentsService } from './services/emoji-recents.service';
export { EmojiSkinToneService } from './services/emoji-skintone.service';
