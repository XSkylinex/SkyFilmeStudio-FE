import { resolveDirectionalShortcutId } from './resolve-directional-shortcut-id';
import { SHORTCUT_REGISTRY } from '../shortcuts.constants';
import type { ShortcutId } from '../keyboard.interface';
import type { TranslationKey } from '@/lib/i18n/catalogue/en';

const SHORTCUT_DESCRIPTION_KEY_BY_ID = new Map<ShortcutId, TranslationKey>(
  SHORTCUT_REGISTRY.map((entry) => [entry.id, entry.descriptionKey]),
);

export const resolveShortcutDescriptionKey = (
  id: ShortcutId,
  direction: string,
): TranslationKey | undefined =>
  SHORTCUT_DESCRIPTION_KEY_BY_ID.get(
    resolveDirectionalShortcutId(id, direction),
  );
