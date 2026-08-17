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
  readonly description: string;
}

export interface FiredShortcut {
  readonly id: ShortcutId;
}

export interface KeyboardShortcutsContextValue {
  readonly lastFiredShortcut: FiredShortcut | null;
}
