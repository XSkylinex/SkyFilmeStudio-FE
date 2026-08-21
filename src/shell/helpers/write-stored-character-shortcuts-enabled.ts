import { SHELL_STATE_CHARACTER_SHORTCUTS_STORAGE_KEY } from '@/shell/shell-state.constants';

export const writeStoredCharacterShortcutsEnabled = (
  enabled: boolean,
): void => {
  try {
    globalThis.localStorage?.setItem(
      SHELL_STATE_CHARACTER_SHORTCUTS_STORAGE_KEY,
      String(enabled),
    );
  } catch {
    return;
  }
};
