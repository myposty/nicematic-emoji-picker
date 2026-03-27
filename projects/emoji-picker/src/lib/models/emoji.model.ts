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

export type EmojiLocale = 'en' | 'es' | 'pt';

export const CATEGORY_LABELS: Record<EmojiLocale, Record<EmojiCategory, string>> = {
  en: {
    recent: 'Recent', smileys: 'Smileys', people: 'People', animals: 'Animals & Nature',
    food: 'Food & Drink', travel: 'Travel & Places', activities: 'Activities',
    objects: 'Objects', symbols: 'Symbols', flags: 'Flags',
  },
  es: {
    recent: 'Recientes', smileys: 'Caritas', people: 'Personas', animals: 'Animales',
    food: 'Comida', travel: 'Viajes', activities: 'Actividades',
    objects: 'Objetos', symbols: 'Símbolos', flags: 'Banderas',
  },
  pt: {
    recent: 'Recentes', smileys: 'Sorrisos', people: 'Pessoas', animals: 'Animais',
    food: 'Comida', travel: 'Viagens', activities: 'Atividades',
    objects: 'Objetos', symbols: 'Símbolos', flags: 'Bandeiras',
  },
};

export const CATEGORY_ICONS: Record<EmojiCategory, string> = {
  recent: '🕐', smileys: '😀', people: '👋', animals: '🐻', food: '🍔',
  travel: '✈️', activities: '⚽', objects: '💡', symbols: '💕', flags: '🏁',
};

export function getCategories(locale: EmojiLocale = 'es'): CategoryMeta[] {
  const labels = CATEGORY_LABELS[locale] || CATEGORY_LABELS['es'];
  return (Object.keys(CATEGORY_ICONS) as EmojiCategory[]).map(id => ({
    id,
    label: labels[id],
    icon: CATEGORY_ICONS[id],
  }));
}

export const CATEGORIES: CategoryMeta[] = getCategories('es');

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
