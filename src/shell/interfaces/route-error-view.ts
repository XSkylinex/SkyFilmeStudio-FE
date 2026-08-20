import type { TranslationKey } from '@/lib/i18n/catalogue/en';
import type { TranslationValues } from '@/lib/i18n/interfaces/catalogue';

export interface RouteErrorView {
  readonly detail: string;
  readonly descriptionKey?: TranslationKey | undefined;
  readonly descriptionValues?: TranslationValues | undefined;
  readonly descriptionDetail?: string | undefined;
  readonly isUnknownError: boolean;
}
