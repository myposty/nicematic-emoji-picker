import { EmojiLocale } from '../../models/emoji.model';
import { ES_TRANSLATIONS } from './es';
import { PT_TRANSLATIONS } from './pt';
import { FR_TRANSLATIONS } from './fr';
import { DE_TRANSLATIONS } from './de';
import { IT_TRANSLATIONS } from './it';
import { RU_TRANSLATIONS } from './ru';
import { JA_TRANSLATIONS } from './ja';
import { KO_TRANSLATIONS } from './ko';
import { ZH_TRANSLATIONS } from './zh';
import { AR_TRANSLATIONS } from './ar';
import { HI_TRANSLATIONS } from './hi';
import { TR_TRANSLATIONS } from './tr';
import { PL_TRANSLATIONS } from './pl';
import { NL_TRANSLATIONS } from './nl';
import { SV_TRANSLATIONS } from './sv';
import { DA_TRANSLATIONS } from './da';
import { UK_TRANSLATIONS } from './uk';
import { TH_TRANSLATIONS } from './th';
import { VI_TRANSLATIONS } from './vi';
import { ID_TRANSLATIONS } from './id';
import { MS_TRANSLATIONS } from './ms';

export type SearchTranslations = Record<string, string[]>;

const SEARCH_TRANSLATIONS: Partial<Record<EmojiLocale, SearchTranslations>> = {
  es: ES_TRANSLATIONS,
  pt: PT_TRANSLATIONS,
  fr: FR_TRANSLATIONS,
  de: DE_TRANSLATIONS,
  it: IT_TRANSLATIONS,
  ru: RU_TRANSLATIONS,
  ja: JA_TRANSLATIONS,
  ko: KO_TRANSLATIONS,
  zh: ZH_TRANSLATIONS,
  ar: AR_TRANSLATIONS,
  hi: HI_TRANSLATIONS,
  tr: TR_TRANSLATIONS,
  pl: PL_TRANSLATIONS,
  nl: NL_TRANSLATIONS,
  sv: SV_TRANSLATIONS,
  da: DA_TRANSLATIONS,
  uk: UK_TRANSLATIONS,
  th: TH_TRANSLATIONS,
  vi: VI_TRANSLATIONS,
  id: ID_TRANSLATIONS,
  ms: MS_TRANSLATIONS,
};

export function getSearchTranslations(locale: EmojiLocale): SearchTranslations | undefined {
  if (locale === 'en') return undefined;
  return SEARCH_TRANSLATIONS[locale];
}
