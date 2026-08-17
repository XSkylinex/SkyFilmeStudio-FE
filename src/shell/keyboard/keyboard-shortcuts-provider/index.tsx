import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { KeyboardShortcutsContext } from '../keyboard-shortcuts.context';
import { isEditableTarget } from '../helpers/is-editable-target';
import { SHORTCUT_REGISTRY } from '../shortcuts.constants';
import type {
  FiredShortcut,
  KeyboardShortcutsContextValue,
} from '../keyboard.interface';
import type { KeyboardShortcutsProviderProps } from './keyboard-shortcuts-provider.interface';
import { ShortcutsHelp } from '../shortcuts-help';

export const KeyboardShortcutsProvider: FC<KeyboardShortcutsProviderProps> = ({
  children,
}) => {
  const [lastFiredShortcut, setLastFiredShortcut] =
    useState<FiredShortcut | null>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.ctrlKey || event.metaKey || event.altKey) {
        return;
      }
      if (isEditableTarget(event.target)) {
        return;
      }

      const shortcut = SHORTCUT_REGISTRY.find(
        (entry) => entry.key === event.key,
      );
      if (!shortcut) {
        return;
      }

      setLastFiredShortcut({ id: shortcut.id });
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const value: KeyboardShortcutsContextValue = { lastFiredShortcut };

  return (
    <KeyboardShortcutsContext.Provider value={value}>
      {children}
      <ShortcutsHelp />
    </KeyboardShortcutsContext.Provider>
  );
};
