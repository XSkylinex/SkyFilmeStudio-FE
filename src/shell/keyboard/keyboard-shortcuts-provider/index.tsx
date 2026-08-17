import type { FC } from 'react';
import { useEffect, useRef } from 'react';
import { KeyboardShortcutsContext } from '../keyboard-shortcuts.context';
import { isEditableTarget } from '../helpers/is-editable-target';
import { isModalOpen } from '../helpers/is-modal-open';
import { resolveDirectionalShortcutId } from '../helpers/resolve-directional-shortcut-id';
import { SHORTCUT_REGISTRY } from '../shortcuts.constants';
import type {
  KeyboardShortcutsContextValue,
  ShortcutId,
  ShortcutListener,
} from '../keyboard.interface';
import type { KeyboardShortcutsProviderProps } from './keyboard-shortcuts-provider.interface';
import { ShortcutsHelp } from '../shortcuts-help';

export const KeyboardShortcutsProvider: FC<KeyboardShortcutsProviderProps> = ({
  children,
}) => {
  const listenersRef = useRef<Map<ShortcutId, Set<ShortcutListener>>>(
    new Map(),
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.ctrlKey || event.metaKey || event.altKey) {
        return;
      }
      if (isEditableTarget(event.target, event.key)) {
        return;
      }
      if (isModalOpen()) {
        return;
      }

      const shortcut = SHORTCUT_REGISTRY.find(
        (entry) => entry.key === event.key,
      );
      if (!shortcut) {
        return;
      }

      const id = resolveDirectionalShortcutId(
        shortcut.id,
        document.documentElement.dir,
      );
      const listeners = listenersRef.current.get(id);
      if (!listeners || listeners.size === 0) {
        return;
      }

      event.preventDefault();
      listeners.forEach((listener) => listener());
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const subscribe = (
    id: ShortcutId,
    listener: ShortcutListener,
  ): (() => void) => {
    const listeners =
      listenersRef.current.get(id) ?? new Set<ShortcutListener>();
    listeners.add(listener);
    listenersRef.current.set(id, listeners);

    return () => {
      listeners.delete(listener);
    };
  };

  const value: KeyboardShortcutsContextValue = { subscribe };

  return (
    <KeyboardShortcutsContext.Provider value={value}>
      {children}
      <ShortcutsHelp />
    </KeyboardShortcutsContext.Provider>
  );
};
