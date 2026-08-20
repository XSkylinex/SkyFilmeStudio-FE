import type { InterfaceLanguage } from '@/lib/i18n/interfaces/interface-language';

export const INTERFACE_LANGUAGE = {
  EN: 'en',
  HE: 'he',
} satisfies Record<string, InterfaceLanguage>;

export const DEFAULT_INTERFACE_LANGUAGE: InterfaceLanguage =
  INTERFACE_LANGUAGE.EN;

export const INTERFACE_LANGUAGE_STORAGE_KEY = 'studio.shell.interface-language';

export const RTL_PRIMARY_SUBTAGS: ReadonlySet<string> = new Set([
  'ae',
  'ar',
  'arc',
  'bcc',
  'bqi',
  'ckb',
  'dv',
  'fa',
  'glk',
  'he',
  'ku',
  'mzn',
  'nqo',
  'pnb',
  'ps',
  'sd',
  'ug',
  'ur',
  'yi',
]);
