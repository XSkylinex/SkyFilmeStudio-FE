import type { TranslationKey } from '@/lib/i18n/catalogue/en';

const SHORTCUT_KEY_LABEL_KEY: Record<string, TranslationKey> = {
  ' ': 'shortcuts.key.space',
};

export const resolveShortcutKeyLabelKey = (
  key: string,
): TranslationKey | undefined => SHORTCUT_KEY_LABEL_KEY[key];
