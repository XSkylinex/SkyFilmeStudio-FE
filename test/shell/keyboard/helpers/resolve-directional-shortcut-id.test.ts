import { resolveDirectionalShortcutId } from '@/shell/keyboard/helpers/resolve-directional-shortcut-id';

describe('resolveDirectionalShortcutId', () => {
  it('leaves next/previous shot unchanged under ltr', () => {
    expect(resolveDirectionalShortcutId('next-shot', 'ltr')).toBe('next-shot');
    expect(resolveDirectionalShortcutId('previous-shot', 'ltr')).toBe(
      'previous-shot',
    );
  });

  it('swaps next/previous shot under rtl, so the physical key still moves in reading order', () => {
    expect(resolveDirectionalShortcutId('next-shot', 'rtl')).toBe(
      'previous-shot',
    );
    expect(resolveDirectionalShortcutId('previous-shot', 'rtl')).toBe(
      'next-shot',
    );
  });

  it('leaves a non-directional shortcut unaffected by direction', () => {
    expect(resolveDirectionalShortcutId('approve', 'rtl')).toBe('approve');
  });
});
