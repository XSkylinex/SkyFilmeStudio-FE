import type { PanelLayout, Theme } from '@/shell/interfaces/shell-state';

export const THEME = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
} satisfies Record<string, Theme>;

export const SHELL_STATE_NAV_COLLAPSED_STORAGE_KEY =
  'studio.shell.nav-collapsed';

export const SHELL_STATE_CHARACTER_SHORTCUTS_STORAGE_KEY =
  'studio.shell.character-shortcuts-enabled';

export const DEFAULT_CHARACTER_SHORTCUTS_ENABLED = true;

const DEFAULT_SECONDARY_PANEL_WIDTH_PX = 320;

export const DEFAULT_PANEL_LAYOUT: PanelLayout = {
  secondaryPanelOpen: true,
  secondaryPanelWidthPx: DEFAULT_SECONDARY_PANEL_WIDTH_PX,
};

export const DEFAULT_THEME: Theme = THEME.SYSTEM;
