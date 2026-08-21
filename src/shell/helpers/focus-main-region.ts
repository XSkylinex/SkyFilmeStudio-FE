import { APP_SHELL_MAIN_ID } from '@/shell/app-shell/app-shell.constants';

export const focusMainRegion = (): void => {
  document.getElementById(APP_SHELL_MAIN_ID)?.focus();
};
