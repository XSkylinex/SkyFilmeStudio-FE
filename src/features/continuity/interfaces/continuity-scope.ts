import type { TranslationKey } from '@/lib/i18n/catalogue/en';
import type { TranslationValues } from '@/lib/i18n/interfaces/catalogue';

export interface ContinuityScope {
  readonly messageKey: TranslationKey;
  readonly values: TranslationValues;
}
