import { createContext } from 'react';
import type { ShellStateContextValue } from './shell-state.interface';

export const ShellStateContext = createContext<ShellStateContextValue | null>(
  null,
);
