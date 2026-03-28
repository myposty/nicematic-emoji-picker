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

export type EmojiLocale = 'en' | 'es' | 'pt' | 'fr' | 'de' | 'it' | 'ja' | 'ko' | 'zh' | 'ru' | 'ar' | 'hi';

export interface LocaleStrings {
  categories: Record<EmojiCategory, string>;
  search: string;
  noResults: string;
}

export const LOCALE_DATA: Record<EmojiLocale, LocaleStrings> = {
  en: {
    categories: { recent: 'Recent', smileys: 'Smileys', people: 'People', animals: 'Animals & Nature', food: 'Food & Drink', travel: 'Travel & Places', activities: 'Activities', objects: 'Objects', symbols: 'Symbols', flags: 'Flags' },
    search: 'Search emoji', noResults: 'No emojis found',
  },
  es: {
    categories: { recent: 'Recientes', smileys: 'Caritas', people: 'Personas', animals: 'Animales', food: 'Comida', travel: 'Viajes', activities: 'Actividades', objects: 'Objetos', symbols: 'Símbolos', flags: 'Banderas' },
    search: 'Buscar emoji', noResults: 'No se encontraron emojis',
  },
  pt: {
    categories: { recent: 'Recentes', smileys: 'Sorrisos', people: 'Pessoas', animals: 'Animais', food: 'Comida', travel: 'Viagens', activities: 'Atividades', objects: 'Objetos', symbols: 'Símbolos', flags: 'Bandeiras' },
    search: 'Pesquisar emoji', noResults: 'Nenhum emoji encontrado',
  },
  fr: {
    categories: { recent: 'Récents', smileys: 'Sourires', people: 'Personnes', animals: 'Animaux', food: 'Nourriture', travel: 'Voyages', activities: 'Activités', objects: 'Objets', symbols: 'Symboles', flags: 'Drapeaux' },
    search: 'Rechercher emoji', noResults: 'Aucun emoji trouvé',
  },
  de: {
    categories: { recent: 'Zuletzt', smileys: 'Smileys', people: 'Personen', animals: 'Tiere & Natur', food: 'Essen & Trinken', travel: 'Reisen & Orte', activities: 'Aktivitäten', objects: 'Objekte', symbols: 'Symbole', flags: 'Flaggen' },
    search: 'Emoji suchen', noResults: 'Keine Emojis gefunden',
  },
  it: {
    categories: { recent: 'Recenti', smileys: 'Faccine', people: 'Persone', animals: 'Animali', food: 'Cibo', travel: 'Viaggi', activities: 'Attività', objects: 'Oggetti', symbols: 'Simboli', flags: 'Bandiere' },
    search: 'Cerca emoji', noResults: 'Nessun emoji trovato',
  },
  ja: {
    categories: { recent: '最近', smileys: 'スマイリー', people: '人', animals: '動物と自然', food: '食べ物', travel: '旅行', activities: 'アクティビティ', objects: 'オブジェクト', symbols: '記号', flags: '旗' },
    search: '絵文字を検索', noResults: '絵文字が見つかりません',
  },
  ko: {
    categories: { recent: '최근', smileys: '스마일리', people: '사람', animals: '동물', food: '음식', travel: '여행', activities: '활동', objects: '사물', symbols: '기호', flags: '깃발' },
    search: '이모지 검색', noResults: '이모지를 찾을 수 없습니다',
  },
  zh: {
    categories: { recent: '最近', smileys: '笑脸', people: '人物', animals: '动物', food: '食物', travel: '旅行', activities: '活动', objects: '物品', symbols: '符号', flags: '旗帜' },
    search: '搜索表情', noResults: '未找到表情',
  },
  ru: {
    categories: { recent: 'Недавние', smileys: 'Смайлики', people: 'Люди', animals: 'Животные', food: 'Еда', travel: 'Путешествия', activities: 'Активности', objects: 'Объекты', symbols: 'Символы', flags: 'Флаги' },
    search: 'Поиск эмодзи', noResults: 'Эмодзи не найдены',
  },
  ar: {
    categories: { recent: 'الأخيرة', smileys: 'وجوه', people: 'أشخاص', animals: 'حيوانات', food: 'طعام', travel: 'سفر', activities: 'أنشطة', objects: 'أشياء', symbols: 'رموز', flags: 'أعلام' },
    search: 'بحث إيموجي', noResults: 'لم يتم العثور على إيموجي',
  },
  hi: {
    categories: { recent: 'हाल के', smileys: 'स्माइली', people: 'लोग', animals: 'जानवर', food: 'खाना', travel: 'यात्रा', activities: 'गतिविधियाँ', objects: 'वस्तुएँ', symbols: 'प्रतीक', flags: 'झंडे' },
    search: 'इमोजी खोजें', noResults: 'कोई इमोजी नहीं मिला',
  },
};

export function getLocaleStrings(locale: EmojiLocale = 'es'): LocaleStrings {
  return LOCALE_DATA[locale] || LOCALE_DATA['es'];
}

export function getCategories(locale: EmojiLocale = 'es'): CategoryMeta[] {
  const strings = getLocaleStrings(locale);
  return (Object.keys(CATEGORY_ICONS) as EmojiCategory[]).map(id => ({
    id,
    label: strings.categories[id],
    icon: CATEGORY_ICONS[id],
  }));
}

export const CATEGORY_ICONS: Record<EmojiCategory, string> = {
  recent: '🕐', smileys: '😀', people: '👋', animals: '🐻', food: '🍔',
  travel: '✈️', activities: '⚽', objects: '💡', symbols: '💕', flags: '🏁',
};

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
  maxRecents: 10,
  locale: 'en',
  showSearch: true,
  showCategories: true,
  showSkinTones: false,
  includeCategories: [],
  pickerHeight: 400,
  pickerWidth: 420,
};
