import {
  DEFAULT_CHARACTER_SHORTCUTS_ENABLED,
  SHELL_STATE_CHARACTER_SHORTCUTS_STORAGE_KEY,
} from '@/shell/shell-state.constants';

export const readStoredCharacterShortcutsEnabled = (): boolean => {
  try {
    const stored = globalThis.localStorage?.getItem(
      SHELL_STATE_CHARACTER_SHORTCUTS_STORAGE_KEY,
    );

    return stored === null || stored === undefined
      ? DEFAULT_CHARACTER_SHORTCUTS_ENABLED
      : stored === 'true';
  } catch {
    return DEFAULT_CHARACTER_SHORTCUTS_ENABLED;
  }
};
