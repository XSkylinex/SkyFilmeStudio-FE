import { interpolate } from '@/lib/i18n/helpers/interpolate';
import type { TranslationKey } from '@/lib/i18n/catalogue/en';
import type {
  Catalogue,
  TranslationValues,
} from '@/lib/i18n/interfaces/catalogue';

export const translate = (
  catalogue: Catalogue,
  key: TranslationKey,
  values?: TranslationValues,
): string => interpolate(catalogue[key], values);
