import { INTERFACE_LANGUAGE_STORAGE_KEY } from '@/lib/i18n/i18n.constants';
import type { InterfaceLanguage } from '@/lib/i18n/interfaces/interface-language';

export const writeStoredInterfaceLanguage = (
  language: InterfaceLanguage,
): void => {
  try {
    globalThis.localStorage?.setItem(INTERFACE_LANGUAGE_STORAGE_KEY, language);
  } catch {
    return;
  }
};
