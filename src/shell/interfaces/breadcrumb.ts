import type { TranslationKey } from '@/lib/i18n/catalogue/en';

export interface Breadcrumb {
  readonly titleKey: TranslationKey;
  readonly pathname: string;
}
