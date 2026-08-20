import { createContext } from 'react';
import type { KeyboardShortcutsContextValue } from './keyboard.interface';

export const KeyboardShortcutsContext =
  createContext<KeyboardShortcutsContextValue | null>(null);
