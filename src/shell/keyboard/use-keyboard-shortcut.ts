import { useEffect, useEffectEvent } from 'react';
import { useKeyboardShortcutsContext } from './use-keyboard-shortcuts-context';
import type { ShortcutId } from './keyboard.interface';

export const useKeyboardShortcut = (
  id: ShortcutId,
  handler: () => void,
): void => {
  const { subscribe } = useKeyboardShortcutsContext();
  const handleFire = useEffectEvent(handler);

  useEffect(() => {
    return subscribe(id, () => {
      handleFire();
    });
  }, [id, subscribe]);
};
