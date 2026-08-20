import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { readStoredNavCollapsed } from '@/shell/helpers/read-stored-nav-collapsed';
import { readStoredInterfaceLanguage } from '@/lib/i18n/helpers/read-stored-interface-language';
import {
  DEFAULT_PANEL_LAYOUT,
  DEFAULT_THEME,
} from '@/shell/shell-state.constants';
import type { InterfaceLanguage } from '@/lib/i18n/interfaces/interface-language';
import type {
  PanelLayout,
  ShellSliceRootState,
  ShellState,
  Theme,
} from '@/shell/interfaces/shell-state';

const initialState: ShellState = {
  panelLayout: DEFAULT_PANEL_LAYOUT,
  theme: DEFAULT_THEME,
  navCollapsed: readStoredNavCollapsed(),
  interfaceLanguage: readStoredInterfaceLanguage(),
};

export const shellSlice = createSlice({
  name: 'shell',
  initialState,
  reducers: {
    panelLayoutSet: (state, action: PayloadAction<PanelLayout>) => {
      state.panelLayout = action.payload;
    },
    themeSet: (state, action: PayloadAction<Theme>) => {
      state.theme = action.payload;
    },
    navCollapsedToggled: (state) => {
      state.navCollapsed = !state.navCollapsed;
    },
    interfaceLanguageSet: (state, action: PayloadAction<InterfaceLanguage>) => {
      state.interfaceLanguage = action.payload;
    },
  },
});

export const {
  panelLayoutSet,
  themeSet,
  navCollapsedToggled,
  interfaceLanguageSet,
} = shellSlice.actions;

export const selectPanelLayout = (state: ShellSliceRootState): PanelLayout =>
  state.shell.panelLayout;

export const selectTheme = (state: ShellSliceRootState): Theme =>
  state.shell.theme;

export const selectNavCollapsed = (state: ShellSliceRootState): boolean =>
  state.shell.navCollapsed;

export const selectInterfaceLanguage = (
  state: ShellSliceRootState,
): InterfaceLanguage => state.shell.interfaceLanguage;
