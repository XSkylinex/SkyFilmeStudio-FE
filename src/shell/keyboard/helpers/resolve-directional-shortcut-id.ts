import type { ShortcutId } from '../keyboard.interface';

const OPPOSITE_DIRECTIONAL_SHORTCUT: Partial<Record<ShortcutId, ShortcutId>> = {
  'next-shot': 'previous-shot',
  'previous-shot': 'next-shot',
};

export const resolveDirectionalShortcutId = (
  id: ShortcutId,
  direction: string,
): ShortcutId => {
  if (direction !== 'rtl') {
    return id;
  }

  return OPPOSITE_DIRECTIONAL_SHORTCUT[id] ?? id;
};
