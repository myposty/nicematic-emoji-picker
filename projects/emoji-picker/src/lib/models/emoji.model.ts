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

export type EmojiLocale = 'en' | 'es' | 'pt' | 'fr' | 'de' | 'it' | 'ja' | 'ko' | 'zh' | 'ru' | 'ar' | 'hi' | 'tr' | 'pl' | 'nl' | 'sv' | 'da' | 'uk' | 'th' | 'vi' | 'id' | 'ms';

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
    categories: { recent: 'Recientes', smileys: 'Caritas', people: 'Personas', animals: 'Animales y Naturaleza', food: 'Comida y Bebida', travel: 'Viajes y Lugares', activities: 'Actividades', objects: 'Objetos', symbols: 'Símbolos', flags: 'Banderas' },
    search: 'Buscar emoji', noResults: 'No se encontraron emojis',
  },
  pt: {
    categories: { recent: 'Recentes', smileys: 'Emoticons', people: 'Pessoas', animals: 'Animais & Natureza', food: 'Comida & Bebida', travel: 'Viagens & Lugares', activities: 'Atividades', objects: 'Objetos', symbols: 'Símbolos', flags: 'Bandeiras' },
    search: 'Pesquisar emoji', noResults: 'Nenhum emoji encontrado',
  },
  fr: {
    categories: { recent: 'Récents', smileys: 'Émoticônes', people: 'Personnes', animals: 'Animaux & Nature', food: 'Nourriture & Boissons', travel: 'Voyages & Lieux', activities: 'Activités', objects: 'Objets', symbols: 'Symboles', flags: 'Drapeaux' },
    search: 'Rechercher un emoji', noResults: 'Aucun emoji trouvé',
  },
  de: {
    categories: { recent: 'Zuletzt verwendet', smileys: 'Smileys & Emotionen', people: 'Personen', animals: 'Tiere & Natur', food: 'Essen & Trinken', travel: 'Reisen & Orte', activities: 'Aktivitäten', objects: 'Objekte', symbols: 'Symbole', flags: 'Flaggen' },
    search: 'Emoji suchen', noResults: 'Keine Emojis gefunden',
  },
  it: {
    categories: { recent: 'Recenti', smileys: 'Faccine', people: 'Persone', animals: 'Animali & Natura', food: 'Cibo & Bevande', travel: 'Viaggi & Luoghi', activities: 'Attività', objects: 'Oggetti', symbols: 'Simboli', flags: 'Bandiere' },
    search: 'Cerca emoji', noResults: 'Nessun emoji trovato',
  },
  ja: {
    categories: { recent: '最近使用', smileys: 'スマイリー', people: '人物', animals: '動物と自然', food: '食べ物と飲み物', travel: '旅行と場所', activities: 'アクティビティ', objects: 'もの', symbols: '記号', flags: '旗' },
    search: '絵文字を検索', noResults: '絵文字が見つかりません',
  },
  ko: {
    categories: { recent: '최근 사용', smileys: '스마일리', people: '사람', animals: '동물과 자연', food: '음식과 음료', travel: '여행과 장소', activities: '활동', objects: '사물', symbols: '기호', flags: '깃발' },
    search: '이모지 검색', noResults: '이모지를 찾을 수 없습니다',
  },
  zh: {
    categories: { recent: '最近使用', smileys: '笑脸与表情', people: '人物', animals: '动物与自然', food: '食物与饮品', travel: '旅行与地点', activities: '活动', objects: '物品', symbols: '符号', flags: '旗帜' },
    search: '搜索表情', noResults: '未找到表情',
  },
  ru: {
    categories: { recent: 'Недавние', smileys: 'Смайлики', people: 'Люди', animals: 'Животные и природа', food: 'Еда и напитки', travel: 'Путешествия и места', activities: 'Активности', objects: 'Объекты', symbols: 'Символы', flags: 'Флаги' },
    search: 'Поиск эмодзи', noResults: 'Эмодзи не найдены',
  },
  ar: {
    categories: { recent: 'الأخيرة', smileys: 'الوجوه والمشاعر', people: 'الأشخاص', animals: 'الحيوانات والطبيعة', food: 'الطعام والشراب', travel: 'السفر والأماكن', activities: 'الأنشطة', objects: 'الأشياء', symbols: 'الرموز', flags: 'الأعلام' },
    search: 'بحث إيموجي', noResults: 'لم يتم العثور على إيموجي',
  },
  hi: {
    categories: { recent: 'हाल के', smileys: 'चेहरे और भावनाएँ', people: 'लोग', animals: 'जानवर और प्रकृति', food: 'खाना और पीना', travel: 'यात्रा और स्थान', activities: 'गतिविधियाँ', objects: 'वस्तुएँ', symbols: 'प्रतीक', flags: 'झंडे' },
    search: 'इमोजी खोजें', noResults: 'कोई इमोजी नहीं मिला',
  },
  tr: {
    categories: { recent: 'Son', smileys: 'İfadeler', people: 'Kişiler', animals: 'Hayvanlar', food: 'Yiyecek İçecek', travel: 'Seyahat', activities: 'Etkinlikler', objects: 'Nesneler', symbols: 'Semboller', flags: 'Bayraklar' },
    search: 'Emoji ara', noResults: 'Emoji bulunamadı',
  },
  pl: {
    categories: { recent: 'Ostatnie', smileys: 'Emotikony', people: 'Ludzie', animals: 'Zwierzęta i natura', food: 'Jedzenie i picie', travel: 'Podróże i miejsca', activities: 'Aktywności', objects: 'Przedmioty', symbols: 'Symbole', flags: 'Flagi' },
    search: 'Szukaj emoji', noResults: 'Nie znaleziono emoji',
  },
  nl: {
    categories: { recent: 'Recent', smileys: 'Smileys', people: 'Mensen', animals: 'Dieren & Natuur', food: 'Eten & Drinken', travel: 'Reizen & Plaatsen', activities: 'Activiteiten', objects: 'Objecten', symbols: 'Symbolen', flags: 'Vlaggen' },
    search: 'Emoji zoeken', noResults: 'Geen emoji gevonden',
  },
  sv: {
    categories: { recent: 'Senaste', smileys: 'Smileys', people: 'Personer', animals: 'Djur & Natur', food: 'Mat & Dryck', travel: 'Resor & Platser', activities: 'Aktiviteter', objects: 'Föremål', symbols: 'Symboler', flags: 'Flaggor' },
    search: 'Sök emoji', noResults: 'Inga emojis hittades',
  },
  da: {
    categories: { recent: 'Seneste', smileys: 'Smileys', people: 'Personer', animals: 'Dyr & Natur', food: 'Mad & Drikke', travel: 'Rejser & Steder', activities: 'Aktiviteter', objects: 'Objekter', symbols: 'Symboler', flags: 'Flag' },
    search: 'Søg emoji', noResults: 'Ingen emoji fundet',
  },
  uk: {
    categories: { recent: 'Останні', smileys: 'Смайлики', people: 'Люди', animals: 'Тварини і природа', food: 'Їжа та напої', travel: 'Подорожі та місця', activities: 'Активності', objects: "Об'єкти", symbols: 'Символи', flags: 'Прапори' },
    search: 'Шукати емодзі', noResults: 'Емодзі не знайдено',
  },
  th: {
    categories: { recent: 'ล่าสุด', smileys: 'หน้ายิ้มและอารมณ์', people: 'ผู้คน', animals: 'สัตว์และธรรมชาติ', food: 'อาหารและเครื่องดื่ม', travel: 'การเดินทางและสถานที่', activities: 'กิจกรรม', objects: 'วัตถุ', symbols: 'สัญลักษณ์', flags: 'ธง' },
    search: 'ค้นหาอีโมจิ', noResults: 'ไม่พบอีโมจิ',
  },
  vi: {
    categories: { recent: 'Gần đây', smileys: 'Mặt cười & Cảm xúc', people: 'Con người', animals: 'Động vật & Thiên nhiên', food: 'Đồ ăn & Thức uống', travel: 'Du lịch & Địa điểm', activities: 'Hoạt động', objects: 'Đồ vật', symbols: 'Biểu tượng', flags: 'Cờ' },
    search: 'Tìm kiếm emoji', noResults: 'Không tìm thấy emoji',
  },
  id: {
    categories: { recent: 'Terbaru', smileys: 'Wajah & Emosi', people: 'Orang', animals: 'Hewan & Alam', food: 'Makanan & Minuman', travel: 'Perjalanan & Tempat', activities: 'Aktivitas', objects: 'Objek', symbols: 'Simbol', flags: 'Bendera' },
    search: 'Cari emoji', noResults: 'Emoji tidak ditemukan',
  },
  ms: {
    categories: { recent: 'Terkini', smileys: 'Wajah & Emosi', people: 'Orang', animals: 'Haiwan & Alam', food: 'Makanan & Minuman', travel: 'Perjalanan & Tempat', activities: 'Aktiviti', objects: 'Objek', symbols: 'Simbol', flags: 'Bendera' },
    search: 'Carian emoji', noResults: 'Emoji tidak dijumpai',
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
