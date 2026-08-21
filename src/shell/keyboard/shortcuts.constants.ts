import type { ShortcutDefinition, ShortcutId } from './keyboard.interface';

export const SHORTCUT_ID = {
  NEXT_SHOT: 'next-shot',
  PREVIOUS_SHOT: 'previous-shot',
  APPROVE: 'approve',
  REJECT: 'reject',
  TOGGLE_PLAYBACK: 'toggle-playback',
  TOGGLE_REFERENCE_COMPARISON: 'toggle-reference-comparison',
  SHOW_SHORTCUTS_HELP: 'show-shortcuts-help',
} satisfies Record<string, ShortcutId>;

export const SHORTCUT_REGISTRY: readonly ShortcutDefinition[] = [
  {
    id: SHORTCUT_ID.NEXT_SHOT,
    key: 'ArrowRight',
    descriptionKey: 'shortcuts.nextShot',
  },
  {
    id: SHORTCUT_ID.PREVIOUS_SHOT,
    key: 'ArrowLeft',
    descriptionKey: 'shortcuts.previousShot',
  },
  {
    id: SHORTCUT_ID.APPROVE,
    key: 'a',
    descriptionKey: 'shortcuts.approve',
  },
  {
    id: SHORTCUT_ID.REJECT,
    key: 'r',
    descriptionKey: 'shortcuts.reject',
  },
  {
    id: SHORTCUT_ID.TOGGLE_PLAYBACK,
    key: ' ',
    descriptionKey: 'shortcuts.togglePlayback',
  },
  {
    id: SHORTCUT_ID.TOGGLE_REFERENCE_COMPARISON,
    key: 'c',
    descriptionKey: 'shortcuts.toggleComparison',
  },
  {
    id: SHORTCUT_ID.SHOW_SHORTCUTS_HELP,
    key: '?',
    descriptionKey: 'shortcuts.showHelp',
  },
];
