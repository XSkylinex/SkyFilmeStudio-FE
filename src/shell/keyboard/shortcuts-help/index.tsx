import type { FC } from 'react';
import { useState } from 'react';
import { Dialog } from '@/lib/components/dialog';
import { useKeyboardShortcut } from '../use-keyboard-shortcut';
import { formatShortcutKey } from '../helpers/format-shortcut-key';
import { SHORTCUT_ID, SHORTCUT_REGISTRY } from '../shortcuts.constants';

const SHORTCUTS_HELP_TITLE = 'Keyboard shortcuts';

export const ShortcutsHelp: FC = () => {
  const [open, setOpen] = useState(false);

  useKeyboardShortcut(SHORTCUT_ID.SHOW_SHORTCUTS_HELP, () => setOpen(true));

  return (
    <Dialog
      open={open}
      title={SHORTCUTS_HELP_TITLE}
      onClose={() => setOpen(false)}
    >
      <ul>
        {SHORTCUT_REGISTRY.map((entry) => (
          <li key={entry.id}>
            <strong>{formatShortcutKey(entry.key)}</strong> —{' '}
            {entry.description}
          </li>
        ))}
      </ul>
    </Dialog>
  );
};
