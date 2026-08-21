import type { FC } from 'react';
import { Button } from '@/lib/components/button';
import { useTranslate } from '@/lib/i18n/use-translate';
import { useKeyboardShortcutsContext } from '../use-keyboard-shortcuts-context';

export const ShortcutsHelpButton: FC = () => {
  const translate = useTranslate();
  const { openShortcutsHelp } = useKeyboardShortcutsContext();

  return (
    <Button variant="ghost" size="sm" onClick={openShortcutsHelp}>
      {translate('shortcuts.title')}
    </Button>
  );
};
