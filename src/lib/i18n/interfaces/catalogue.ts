import type { TranslationKey } from '@/lib/i18n/catalogue/en';

export type Catalogue = Record<TranslationKey, string>;

export type TranslationValues = Readonly<Record<string, string | number>>;

export type Translate = (
  key: TranslationKey,
  values?: TranslationValues,
) => string;
