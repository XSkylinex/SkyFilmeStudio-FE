import type { TranslationKey } from '@/lib/i18n/catalogue/en';

export interface AppShellNavLink {
  readonly to: string;
  readonly labelKey: TranslationKey;
}
