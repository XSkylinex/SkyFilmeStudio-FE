import {
  DEFAULT_INTERFACE_LANGUAGE,
  INTERFACE_LANGUAGE,
  INTERFACE_LANGUAGE_STORAGE_KEY,
} from '@/lib/i18n/i18n.constants';
import type { InterfaceLanguage } from '@/lib/i18n/interfaces/interface-language';

const SUPPORTED: readonly string[] = Object.values(INTERFACE_LANGUAGE);

export const readStoredInterfaceLanguage = (): InterfaceLanguage => {
  let stored: string | null = null;

  try {
    stored =
      globalThis.localStorage?.getItem(INTERFACE_LANGUAGE_STORAGE_KEY) ?? null;
  } catch {
    return DEFAULT_INTERFACE_LANGUAGE;
  }

  return stored !== null && SUPPORTED.includes(stored)
    ? (stored as InterfaceLanguage)
    : DEFAULT_INTERFACE_LANGUAGE;
};
