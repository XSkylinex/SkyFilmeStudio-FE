import type { PanelLayout, Theme } from './shell-state.interface';

export const THEME = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
} satisfies Record<string, Theme>;

export const SHELL_STATE_NAV_COLLAPSED_STORAGE_KEY =
  'studio.shell.nav-collapsed';

const DEFAULT_SECONDARY_PANEL_WIDTH_PX = 320;

export const DEFAULT_PANEL_LAYOUT: PanelLayout = {
  secondaryPanelOpen: true,
  secondaryPanelWidthPx: DEFAULT_SECONDARY_PANEL_WIDTH_PX,
};

export const DEFAULT_THEME: Theme = THEME.SYSTEM;
