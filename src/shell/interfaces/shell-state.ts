export type Theme = 'light' | 'dark' | 'system';

export interface PanelLayout {
  readonly secondaryPanelOpen: boolean;
  readonly secondaryPanelWidthPx: number;
}

export interface ShellState {
  panelLayout: PanelLayout;
  theme: Theme;
  navCollapsed: boolean;
}

export interface ShellSliceRootState {
  shell: ShellState;
}
