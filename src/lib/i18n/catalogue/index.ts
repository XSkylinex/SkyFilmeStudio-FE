import { EN_CATALOGUE } from '@/lib/i18n/catalogue/en';
import { HE_CATALOGUE } from '@/lib/i18n/catalogue/he';
import { INTERFACE_LANGUAGE } from '@/lib/i18n/i18n.constants';
import type { InterfaceLanguage } from '@/lib/i18n/interfaces/interface-language';
import type { Catalogue } from '@/lib/i18n/interfaces/catalogue';

export const CATALOGUE: Record<InterfaceLanguage, Catalogue> = {
  [INTERFACE_LANGUAGE.EN]: EN_CATALOGUE,
  [INTERFACE_LANGUAGE.HE]: HE_CATALOGUE,
};
