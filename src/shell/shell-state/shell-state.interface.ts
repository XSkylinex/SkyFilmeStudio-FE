import type { ReactNode } from 'react';

export type Theme = 'light' | 'dark' | 'system';

export interface PanelLayout {
  readonly secondaryPanelOpen: boolean;
  readonly secondaryPanelWidthPx: number;
}

export interface ShellState {
  readonly panelLayout: PanelLayout;
  readonly theme: Theme;
  readonly navCollapsed: boolean;
}

export interface ShellStateActions {
  readonly setPanelLayout: (panelLayout: PanelLayout) => void;
  readonly setTheme: (theme: Theme) => void;
  readonly toggleNavCollapsed: () => void;
}

export type ShellStateContextValue = ShellState & ShellStateActions;

export interface ShellStateProviderProps {
  children: ReactNode;
}
