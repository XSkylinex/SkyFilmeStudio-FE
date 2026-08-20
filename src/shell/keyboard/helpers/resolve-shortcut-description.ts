import { resolveDirectionalShortcutId } from './resolve-directional-shortcut-id';
import { SHORTCUT_REGISTRY } from '../shortcuts.constants';
import type { ShortcutId } from '../keyboard.interface';

const SHORTCUT_DESCRIPTION_BY_ID = new Map<ShortcutId, string>(
  SHORTCUT_REGISTRY.map((entry) => [entry.id, entry.description]),
);

export const resolveShortcutDescription = (
  id: ShortcutId,
  direction: string,
): string => {
  const resolvedId = resolveDirectionalShortcutId(id, direction);
  return SHORTCUT_DESCRIPTION_BY_ID.get(resolvedId) ?? '';
};
