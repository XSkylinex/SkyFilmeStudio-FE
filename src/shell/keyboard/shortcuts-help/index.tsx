import type { FC } from 'react';
import { Dialog } from '@/lib/components/dialog';
import { useAppDispatch, useAppSelector } from '@/shell/store/hooks';
import {
  characterShortcutsEnabledSet,
  selectCharacterShortcutsEnabled,
} from '@/shell/shell.slice';
import type { ShortcutsHelpProps } from './shortcuts-help.interface';
import { useTranslate } from '@/lib/i18n/use-translate';
import { useKeyboardShortcut } from '../use-keyboard-shortcut';
import { formatShortcutKey } from '../helpers/format-shortcut-key';
import { resolveShortcutKeyLabelKey } from '../helpers/resolve-shortcut-key-label-key';
import { resolveShortcutDescriptionKey } from '../helpers/resolve-shortcut-description';
import { SHORTCUT_ID, SHORTCUT_REGISTRY } from '../shortcuts.constants';
import './shortcuts-help.css';

export const ShortcutsHelp: FC<ShortcutsHelpProps> = ({
  open,
  onOpenChange,
}) => {
  const translate = useTranslate();
  const dispatch = useAppDispatch();
  const characterShortcutsEnabled = useAppSelector(
    selectCharacterShortcutsEnabled,
  );
  const direction = document.documentElement.dir;

  useKeyboardShortcut(SHORTCUT_ID.SHOW_SHORTCUTS_HELP, () =>
    onOpenChange(true),
  );

  return (
    <Dialog
      open={open}
      title={translate('shortcuts.title')}
      onClose={() => onOpenChange(false)}
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
      <label className="shortcuts-help__toggle">
        <input
          type="checkbox"
          checked={characterShortcutsEnabled}
          onChange={(event) =>
            dispatch(characterShortcutsEnabledSet(event.target.checked))
          }
        />
        {translate('shortcuts.singleKey.label')}
      </label>
      <p className="shortcuts-help__toggle-description">
        {translate('shortcuts.singleKey.description')}
      </p>
    </Dialog>
  );
};
