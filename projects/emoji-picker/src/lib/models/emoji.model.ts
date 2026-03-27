/**
 * Fitzpatrick skin tone modifiers
 */
export type SkinTone = '' | '🏻' | '🏼' | '🏽' | '🏾' | '🏿';

export const SKIN_TONES: SkinTone[] = ['', '🏻', '🏼', '🏽', '🏾', '🏿'];

export const SKIN_TONE_LABELS: Record<SkinTone, string> = {
  '': 'Default',
  '🏻': 'Light',
  '🏼': 'Medium-Light',
  '🏽': 'Medium',
  '🏾': 'Medium-Dark',
  '🏿': 'Dark',
};

export interface Emoji {
  /** Unicode character(s) */
  char: string;
  /** Short name / id */
  name: string;
  /** Search keywords */
  keywords: string[];
  /** Category id */
  category: EmojiCategory;
  /** Supports skin tone modifiers */
  hasSkinTone: boolean;
  /** Base codepoint (without skin tone) for grouping variants */
  base?: string;
}

export type EmojiCategory =
  | 'recent'
  | 'smileys'
  | 'people'
  | 'animals'
  | 'food'
  | 'travel'
  | 'activities'
  | 'objects'
  | 'symbols'
  | 'flags';

export interface CategoryMeta {
  id: EmojiCategory;
  label: string;
  icon: string;
}

export const CATEGORIES: CategoryMeta[] = [
  { id: 'recent', label: 'Recientes', icon: '🕐' },
  { id: 'smileys', label: 'Caritas', icon: '😀' },
  { id: 'people', label: 'Personas', icon: '👋' },
  { id: 'animals', label: 'Animales', icon: '🐻' },
  { id: 'food', label: 'Comida', icon: '🍔' },
  { id: 'travel', label: 'Viajes', icon: '✈️' },
  { id: 'activities', label: 'Actividades', icon: '⚽' },
  { id: 'objects', label: 'Objetos', icon: '💡' },
  { id: 'symbols', label: 'Símbolos', icon: '💕' },
  { id: 'flags', label: 'Banderas', icon: '🏁' },
];

export interface EmojiPickerConfig {
  /** Number of columns in the grid */
  columns: number;
  /** Size of each emoji cell in px */
  cellSize: number;
  /** Max recent emojis to store */
  maxRecents: number;
  /** Locale for search keywords */
  locale: string;
  /** Show search bar */
  showSearch: boolean;
  /** Show category bar */
  showCategories: boolean;
  /** Show skin tone selector */
  showSkinTones: boolean;
  /** Categories to include (empty = all) */
  includeCategories: EmojiCategory[];
  /** Picker height in px */
  pickerHeight: number;
  /** Picker width in px */
  pickerWidth: number;
}

export const DEFAULT_CONFIG: EmojiPickerConfig = {
  columns: 9,
  cellSize: 44,
  maxRecents: 50,
  locale: 'en',
  showSearch: true,
  showCategories: true,
  showSkinTones: false,
  includeCategories: [],
  pickerHeight: 400,
  pickerWidth: 420,
};
