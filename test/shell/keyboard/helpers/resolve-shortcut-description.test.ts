import { resolveShortcutDescriptionKey } from '@/shell/keyboard/helpers/resolve-shortcut-description';

describe('resolveShortcutDescriptionKey', () => {
  it('describes a directional shortcut by its own key under ltr', () => {
    expect(resolveShortcutDescriptionKey('next-shot', 'ltr')).toBe(
      'shortcuts.nextShot',
    );
    expect(resolveShortcutDescriptionKey('previous-shot', 'ltr')).toBe(
      'shortcuts.previousShot',
    );
  });

  it('describes what the key actually dispatches under rtl, not the ltr label', () => {
    expect(resolveShortcutDescriptionKey('next-shot', 'rtl')).toBe(
      'shortcuts.previousShot',
    );
    expect(resolveShortcutDescriptionKey('previous-shot', 'rtl')).toBe(
      'shortcuts.nextShot',
    );
  });

  it('leaves a non-directional shortcut unaffected by direction', () => {
    expect(resolveShortcutDescriptionKey('approve', 'rtl')).toBe(
      'shortcuts.approve',
    );
  });
});
