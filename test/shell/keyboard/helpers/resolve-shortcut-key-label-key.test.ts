import { resolveShortcutKeyLabelKey } from '@/shell/keyboard/helpers/resolve-shortcut-key-label-key';

describe('resolveShortcutKeyLabelKey', () => {
  it('names the space key, which would otherwise render as a blank string', () => {
    expect(resolveShortcutKeyLabelKey(' ')).toBe('shortcuts.key.space');
  });

  it('claims no name for a key that is already its own label', () => {
    expect(resolveShortcutKeyLabelKey('a')).toBeUndefined();
    expect(resolveShortcutKeyLabelKey('ArrowLeft')).toBeUndefined();
  });
});
