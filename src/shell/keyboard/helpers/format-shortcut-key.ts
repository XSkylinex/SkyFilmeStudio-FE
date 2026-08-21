const SHORTCUT_KEY_GLYPH: Record<string, string> = {
  ArrowLeft: '\u2190',
  ArrowRight: '\u2192',
};

export const formatShortcutKey = (key: string): string =>
  SHORTCUT_KEY_GLYPH[key] ?? key;
