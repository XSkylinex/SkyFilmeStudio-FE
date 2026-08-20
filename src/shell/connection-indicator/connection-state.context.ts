import { createContext } from 'react';
import type { ConnectionStateContextValue } from './connection-indicator.interface';

export const ConnectionStateContext =
  createContext<ConnectionStateContextValue | null>(null);
