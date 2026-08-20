const SHORTCUT_KEY_DISPLAY_NAME: Record<string, string> = {
  ' ': 'Space',
  ArrowLeft: '←',
  ArrowRight: '→',
};

export const formatShortcutKey = (key: string): string =>
  SHORTCUT_KEY_DISPLAY_NAME[key] ?? key;
