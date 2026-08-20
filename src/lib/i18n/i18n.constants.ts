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
  'iw',
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

export const RTL_SCRIPT_SUBTAGS: ReadonlySet<string> = new Set([
  'adlm',
  'arab',
  'hebr',
  'nkoo',
  'rohg',
  'syrc',
  'thaa',
  'yezi',
]);

export const LTR_SCRIPT_SUBTAGS: ReadonlySet<string> = new Set([
  'cyrl',
  'latn',
]);
