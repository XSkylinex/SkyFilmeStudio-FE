import { SHELL_STATE_NAV_COLLAPSED_STORAGE_KEY } from '@/shell/shell-state.constants';

export const writeStoredNavCollapsed = (navCollapsed: boolean): void => {
  try {
    globalThis.localStorage?.setItem(
      SHELL_STATE_NAV_COLLAPSED_STORAGE_KEY,
      String(navCollapsed),
    );
  } catch {
    return;
  }
};
