import { useContext } from 'react';
import { KeyboardShortcutsContext } from './keyboard-shortcuts.context';
import type { KeyboardShortcutsContextValue } from './keyboard.interface';

export const useKeyboardShortcutsContext =
  (): KeyboardShortcutsContextValue => {
    const value = useContext(KeyboardShortcutsContext);

    if (!value) {
      throw new Error(
        'useKeyboardShortcut must be used within a KeyboardShortcutsProvider.',
      );
    }

    return value;
  };
