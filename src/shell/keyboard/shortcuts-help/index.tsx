import type { FC } from 'react';
import { useState } from 'react';
import { Dialog } from '@/lib/components/dialog';
import { useTranslate } from '@/lib/i18n/use-translate';
import { useKeyboardShortcut } from '../use-keyboard-shortcut';
import { formatShortcutKey } from '../helpers/format-shortcut-key';
import { resolveShortcutKeyLabelKey } from '../helpers/resolve-shortcut-key-label-key';
import { resolveShortcutDescriptionKey } from '../helpers/resolve-shortcut-description';
import { SHORTCUT_ID, SHORTCUT_REGISTRY } from '../shortcuts.constants';

export const ShortcutsHelp: FC = () => {
  const [open, setOpen] = useState(false);
  const translate = useTranslate();
  const direction = document.documentElement.dir;

  useKeyboardShortcut(SHORTCUT_ID.SHOW_SHORTCUTS_HELP, () => setOpen(true));

  return (
    <Dialog
      open={open}
      title={translate('shortcuts.title')}
      onClose={() => setOpen(false)}
    >
      <ul>
        {SHORTCUT_REGISTRY.map((entry) => {
          const keyLabelKey = resolveShortcutKeyLabelKey(entry.key);
          const descriptionKey = resolveShortcutDescriptionKey(
            entry.id,
            direction,
          );

          return (
            <li key={entry.id}>
              {keyLabelKey ? (
                <strong>{translate(keyLabelKey)}</strong>
              ) : (
                <strong dir="ltr">{formatShortcutKey(entry.key)}</strong>
              )}{' '}
              — {descriptionKey ? translate(descriptionKey) : ''}
            </li>
          );
        })}
      </ul>
    </Dialog>
  );
};
