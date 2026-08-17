import { resolveShortcutDescription } from '@/shell/keyboard/helpers/resolve-shortcut-description';

describe('resolveShortcutDescription', () => {
  it('describes a directional shortcut by its own key under ltr', () => {
    expect(resolveShortcutDescription('next-shot', 'ltr')).toBe(
      'Go to the next shot',
    );
    expect(resolveShortcutDescription('previous-shot', 'ltr')).toBe(
      'Go to the previous shot',
    );
  });

  it('describes what the key actually dispatches under rtl, not the ltr label', () => {
    expect(resolveShortcutDescription('next-shot', 'rtl')).toBe(
      'Go to the previous shot',
    );
    expect(resolveShortcutDescription('previous-shot', 'rtl')).toBe(
      'Go to the next shot',
    );
  });

  it('leaves a non-directional shortcut unaffected by direction', () => {
    expect(resolveShortcutDescription('approve', 'rtl')).toBe(
      'Approve the item in review',
    );
  });
});
