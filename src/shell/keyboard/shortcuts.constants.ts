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
    description: 'Go to the next shot',
  },
  {
    id: SHORTCUT_ID.PREVIOUS_SHOT,
    key: 'ArrowLeft',
    description: 'Go to the previous shot',
  },
  {
    id: SHORTCUT_ID.APPROVE,
    key: 'a',
    description: 'Approve the item in review',
  },
  {
    id: SHORTCUT_ID.REJECT,
    key: 'r',
    description: 'Reject the item in review',
  },
  {
    id: SHORTCUT_ID.TOGGLE_PLAYBACK,
    key: ' ',
    description: 'Play or pause the current video',
  },
  {
    id: SHORTCUT_ID.TOGGLE_REFERENCE_COMPARISON,
    key: 'c',
    description: 'Toggle the reference comparison view',
  },
  {
    id: SHORTCUT_ID.SHOW_SHORTCUTS_HELP,
    key: '?',
    description: 'Show this list of keyboard shortcuts',
  },
];
