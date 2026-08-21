import type { TranslationKey } from '@/lib/i18n/catalogue/en';

export type ShortcutId =
  | 'next-shot'
  | 'previous-shot'
  | 'approve'
  | 'reject'
  | 'toggle-playback'
  | 'toggle-reference-comparison'
  | 'show-shortcuts-help';

export interface ShortcutDefinition {
  readonly id: ShortcutId;
  readonly key: string;
  readonly descriptionKey: TranslationKey;
}

export type ShortcutListener = () => void;

export interface KeyboardShortcutsContextValue {
  readonly subscribe: (
    id: ShortcutId,
    listener: ShortcutListener,
  ) => () => void;
}
