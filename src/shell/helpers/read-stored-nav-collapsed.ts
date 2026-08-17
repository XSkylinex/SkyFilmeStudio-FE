import { SHELL_STATE_NAV_COLLAPSED_STORAGE_KEY } from '@/shell/shell-state.constants';

const DEFAULT_NAV_COLLAPSED = false;

export const readStoredNavCollapsed = (): boolean => {
  try {
    return (
      globalThis.localStorage?.getItem(
        SHELL_STATE_NAV_COLLAPSED_STORAGE_KEY,
      ) === 'true'
    );
  } catch {
    return DEFAULT_NAV_COLLAPSED;
  }
};
