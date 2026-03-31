import { EmojiLocale } from '../../models/emoji.model';
import { ES_RAW } from './es';
import { PT_RAW } from './pt';
import { FR_RAW } from './fr';
import { DE_RAW } from './de';
import { IT_RAW } from './it';
import { RU_RAW } from './ru';
import { JA_RAW } from './ja';
import { KO_RAW } from './ko';
import { ZH_RAW } from './zh';
import { AR_RAW } from './ar';
import { HI_RAW } from './hi';
import { TR_RAW } from './tr';
import { PL_RAW } from './pl';
import { NL_RAW } from './nl';
import { SV_RAW } from './sv';
import { DA_RAW } from './da';
import { UK_RAW } from './uk';
import { TH_RAW } from './th';
import { VI_RAW } from './vi';
import { ID_RAW } from './id';
import { MS_RAW } from './ms';

export type SearchTranslations = Record<string, string[]>;

const RAW_DATA: Partial<Record<EmojiLocale, string>> = {
  es: ES_RAW, pt: PT_RAW, fr: FR_RAW, de: DE_RAW, it: IT_RAW,
  ru: RU_RAW, ja: JA_RAW, ko: KO_RAW, zh: ZH_RAW, ar: AR_RAW,
  hi: HI_RAW, tr: TR_RAW, pl: PL_RAW, nl: NL_RAW, sv: SV_RAW,
  da: DA_RAW, uk: UK_RAW, th: TH_RAW, vi: VI_RAW, id: ID_RAW, ms: MS_RAW,
};

const cache = new Map<string, SearchTranslations>();

function parse(raw: string): SearchTranslations {
  const result: SearchTranslations = {};
  for (const entry of raw.split('|')) {
    const i = entry.indexOf(':');
    result[entry.slice(0, i)] = entry.slice(i + 1).split(',');
  }
  return result;
}

export function getSearchTranslations(locale: EmojiLocale): SearchTranslations | undefined {
  if (locale === 'en') return undefined;
  const raw = RAW_DATA[locale];
  if (!raw) return undefined;
  let parsed = cache.get(locale);
  if (!parsed) {
    parsed = parse(raw);
    cache.set(locale, parsed);
  }
  return parsed;
}
