import type { FC } from 'react';
import { useState } from 'react';
import { ShellStateContext } from './shell-state.context';
import {
  DEFAULT_PANEL_LAYOUT,
  DEFAULT_THEME,
  SHELL_STATE_NAV_COLLAPSED_STORAGE_KEY,
} from './shell-state.constants';
import type {
  PanelLayout,
  ShellStateContextValue,
  ShellStateProviderProps,
  Theme,
} from './shell-state.interface';

const DEFAULT_NAV_COLLAPSED = false;

const readStoredNavCollapsed = (): boolean => {
  if (typeof window === 'undefined' || !window.localStorage) {
    return DEFAULT_NAV_COLLAPSED;
  }
  try {
    return (
      window.localStorage.getItem(SHELL_STATE_NAV_COLLAPSED_STORAGE_KEY) ===
      'true'
    );
  } catch {
    return DEFAULT_NAV_COLLAPSED;
  }
};

const writeStoredNavCollapsed = (value: boolean): void => {
  if (typeof window === 'undefined' || !window.localStorage) {
    return;
  }
  try {
    window.localStorage.setItem(
      SHELL_STATE_NAV_COLLAPSED_STORAGE_KEY,
      String(value),
    );
  } catch {
    return;
  }
};

export const ShellStateProvider: FC<ShellStateProviderProps> = ({
  children,
}) => {
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
  const [currentProductionId, setCurrentProductionId] = useState<string | null>(
    null,
  );
  const [panelLayout, setPanelLayout] =
    useState<PanelLayout>(DEFAULT_PANEL_LAYOUT);
  const [theme, setTheme] = useState<Theme>(DEFAULT_THEME);
  const [navCollapsed, setNavCollapsed] = useState<boolean>(
    readStoredNavCollapsed,
  );

  const toggleNavCollapsed = (): void => {
    const next = !navCollapsed;
    writeStoredNavCollapsed(next);
    setNavCollapsed(next);
  };

  const value: ShellStateContextValue = {
    currentProjectId,
    currentProductionId,
    panelLayout,
    theme,
    navCollapsed,
    setCurrentProjectId,
    setCurrentProductionId,
    setPanelLayout,
    setTheme,
    toggleNavCollapsed,
  };

  return (
    <ShellStateContext.Provider value={value}>
      {children}
    </ShellStateContext.Provider>
  );
};
