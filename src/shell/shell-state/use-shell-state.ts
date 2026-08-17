import { useContext } from 'react';
import { ShellStateContext } from './shell-state.context';
import type { ShellStateContextValue } from './shell-state.interface';

export const useShellState = (): ShellStateContextValue => {
  const value = useContext(ShellStateContext);

  if (!value) {
    throw new Error('useShellState must be used within a ShellStateProvider.');
  }

  return value;
};
